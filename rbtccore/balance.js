/**
 * RBTC balance checker for RSK network
 */
require('dotenv').config();
const { ethers } = require('ethers');
const { provider, networkConfig } = require('./connect');

/**
 * Get the RBTC (native) balance of an address.
 * @param {string} address - RSK/Ethereum-style address (0x...)
 * @returns {Promise<{address: string, balanceWei: bigint, balanceRbtc: string}>}
 */
async function getRbtcBalance(address) {
  const checksumAddr = ethers.getAddress(address);
  const balanceWei = await provider.getBalance(checksumAddr);
  const balanceRbtc = ethers.formatEther(balanceWei);

  console.log(`RBTC Balance for ${checksumAddr}: ${balanceRbtc} RBTC`);
  console.log(`Explorer: ${networkConfig.explorer}/address/${checksumAddr}`);

  return { address: checksumAddr, balanceWei, balanceRbtc };
}

/**
 * Get the ERC-20 token balance (e.g., Zwick stablecoin).
 * @param {string} tokenAddress - Deployed token contract address
 * @param {string} walletAddress - Wallet to check
 * @returns {Promise<{symbol: string, balance: string, decimals: number}>}
 */
async function getTokenBalance(tokenAddress, walletAddress) {
  const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
  ];

  const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const [rawBalance, decimals, symbol] = await Promise.all([
    token.balanceOf(walletAddress),
    token.decimals(),
    token.symbol(),
  ]);

  const balance = ethers.formatUnits(rawBalance, decimals);
  console.log(`${symbol} balance for ${walletAddress}: ${balance}`);
  return { symbol, balance, decimals };
}

module.exports = { getRbtcBalance, getTokenBalance };

if (require.main === module) {
  const address = process.argv[2] || process.env.WALLET_ADDRESS;
  if (!address) {
    console.error('Usage: node balance.js <address>');
    process.exit(1);
  }
  getRbtcBalance(address).catch(console.error);
}
