// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZwickToken
 * @notice Zwick stablecoin on RSK (Rootstock Bitcoin sidechain)
 *         1 Zwick = 1 USD, backed by a centralised oracle/reserve.
 * @dev ERC-20 token deployed on RSK mainnet (chainId 30) or testnet (chainId 31).
 *      The owner (a multisig in production) can mint and burn tokens.
 *      A price oracle address can update the USD/RBTC peg rate.
 */

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ZwickToken is IERC20 {
    // ── ERC-20 state ──────────────────────────────────────────────────────────

    string public constant name     = "Zwick Stablecoin";
    string public constant symbol   = "ZWK";
    uint8  public constant decimals = 18;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // ── Zwick-specific state ─────────────────────────────────────────────────

    address public owner;
    address public oracle;          // address authorised to update the peg rate
    uint256 public rbtcUsdRate;     // RBTC price in USD cents (e.g. 6000000 = $60,000)

    // ── Events ────────────────────────────────────────────────────────────────

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event RateUpdated(uint256 newRateUsdCents);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ── Modifiers ─────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "ZwickToken: caller is not the owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle || msg.sender == owner, "ZwickToken: caller is not the oracle");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────────────────

    /**
     * @param initialRateUsdCents Initial RBTC/USD rate in cents (e.g. 6000000 for $60,000).
     * @param oracleAddress       Address of the trusted price oracle.
     */
    constructor(uint256 initialRateUsdCents, address oracleAddress) {
        require(oracleAddress != address(0), "ZwickToken: oracle is zero address");
        owner              = msg.sender;
        oracle             = oracleAddress;
        rbtcUsdRate        = initialRateUsdCents;
    }

    // ── ERC-20 ────────────────────────────────────────────────────────────────

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address owner_, address spender) external view override returns (uint256) {
        return _allowances[owner_][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        uint256 current = _allowances[from][msg.sender];
        require(current >= amount, "ZwickToken: insufficient allowance");
        unchecked { _allowances[from][msg.sender] = current - amount; }
        _transfer(from, to, amount);
        return true;
    }

    // ── Mint / Burn ───────────────────────────────────────────────────────────

    /**
     * @notice Mint new Zwick tokens.
     * @param to     Recipient address.
     * @param amount Amount of Zwick (18 decimals).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "ZwickToken: mint to zero address");
        _totalSupply        += amount;
        _balances[to]       += amount;
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }

    /**
     * @notice Burn Zwick tokens from the caller's balance.
     * @param amount Amount to burn.
     */
    function burn(uint256 amount) external {
        require(_balances[msg.sender] >= amount, "ZwickToken: burn exceeds balance");
        unchecked { _balances[msg.sender] -= amount; }
        _totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
        emit Burn(msg.sender, amount);
    }

    // ── Oracle ────────────────────────────────────────────────────────────────

    /**
     * @notice Update the RBTC/USD rate.
     * @param newRateUsdCents New rate in US cents per RBTC.
     */
    function updateRate(uint256 newRateUsdCents) external onlyOracle {
        require(newRateUsdCents > 0, "ZwickToken: rate must be positive");
        rbtcUsdRate = newRateUsdCents;
        emit RateUpdated(newRateUsdCents);
    }

    /**
     * @notice Calculate how many Zwick a given amount of RBTC (wei) is worth.
     * @param rbtcWei Amount of RBTC in wei.
     * @return zwicks Amount of Zwick (18 decimals).
     */
    function rbtcToZwick(uint256 rbtcWei) external view returns (uint256 zwicks) {
        // rbtcUsdRate is cents per RBTC, so divide by 100 for dollars.
        // 1 Zwick = 1 USD. Result preserves 18 decimals.
        zwicks = (rbtcWei * rbtcUsdRate) / 1e20; // 1e18 (wei→RBTC) * 1e2 (cents→USD)
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZwickToken: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "ZwickToken: oracle is zero address");
        oracle = newOracle;
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ZwickToken: transfer from zero address");
        require(to   != address(0), "ZwickToken: transfer to zero address");
        require(_balances[from] >= amount, "ZwickToken: insufficient balance");
        unchecked {
            _balances[from] -= amount;
            _balances[to]   += amount;
        }
        emit Transfer(from, to, amount);
    }
}
