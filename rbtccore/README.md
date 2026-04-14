# RBTC Core — MoneyOnRoot

RBTC is Bitcoin on the **RSK (Rootstock)** sidechain — a Bitcoin-secured, EVM-compatible network.
This module replaces the original IOTA core and handles all on-chain interaction.

| Network  | Chain ID | RPC                                      | Explorer                          |
|----------|----------|------------------------------------------|-----------------------------------|
| Mainnet  | 30       | https://public-node.rsk.co               | https://explorer.rsk.co           |
| Testnet  | 31       | https://public-node.testnet.rsk.co       | https://explorer.testnet.rsk.co   |

## Requirements

```
Node.js >= 18
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```
RSK_NETWORK=testnet          # or mainnet
PRIVATE_KEY=0x...            # deployer / sender wallet
WALLET_ADDRESS=0x...         # address to query for balance
ORACLE_ADDRESS=0x...         # price oracle address (for ZwickToken)
ZWICK_TOKEN_ADDRESS=0x...    # deployed ZwickToken address (after deploy)
```

## Files

| File | Purpose |
|------|---------|
| `connect.js` | Provider setup, node info, gas price |
| `balance.js` | RBTC and ERC-20 (Zwick) balance queries |
| `transaction.js` | Send RBTC, estimate gas, get tx details |
| `contracts/ZwickToken.sol` | Zwick ERC-20 stablecoin (1 ZWK = 1 USD) |
| `contracts/deploy.js` | Deploy ZwickToken to RSK |

## Quick Start

```bash
cd rbtccore
npm install

# Test node connection
npm run test-node

# Check RBTC balance
node balance.js 0xYourAddress

# Send RBTC
PRIVATE_KEY=0x... node transaction.js 0xRecipient 0.001 "Sending 1 dollar"

# Deploy ZwickToken (requires compiled bytecode in ZWICK_BYTECODE env)
npm run deploy
```

## Zwick Stablecoin on RSK

`ZwickToken.sol` is an ERC-20 deployed on RSK with:
- 1 ZWK = 1 USD (oracle-maintained peg)
- Owner-controlled mint/burn
- `rbtcToZwick(wei)` — converts RBTC amount to Zwick value at current rate
- `updateRate(cents)` — oracle updates RBTC/USD price in US cents

Compile with Hardhat (recommended):

```bash
npx hardhat compile
```

Then set `ZWICK_BYTECODE` from the compiled artifact and run `npm run deploy`.

## Workflow

1. Connect to RSK testnet and confirm block number
2. Fund test wallet from the RSK testnet faucet (https://faucet.rsk.co)
3. Send a test RBTC transfer
4. Deploy ZwickToken
5. Mint Zwick tokens to a wallet
6. Verify on the block explorer
