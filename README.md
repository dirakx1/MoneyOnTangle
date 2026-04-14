# MoneyOnRoot

Transfer Zwick stablecoin on the **RSK (Rootstock Bitcoin)** network.

Money transactions are represented as RBTC transfers and ERC-20 token operations
on the RSK Bitcoin sidechain. The Zwick coin (ZWK) represents exactly 1 US dollar.

## RBTC Stablecoin

* **Zwick (ZWK)** — [Stablecoin on RSK](Stablecoin.md)
* 1 ZWK = 1 USD, maintained by a price oracle
* Deployed as ERC-20 on RSK (EVM-compatible, Bitcoin-secured)

## RSK Network

* RSK makes real-time Bitcoin-backed transactions possible
* Transactions use RBTC (native token, 1:1 pegged with BTC) for gas
* EVM-compatible — supports Solidity smart contracts
* Chain ID: 30 (mainnet), 31 (testnet)
* Full network details in [rbtccore](rbtccore/README.md)

## Agentic AI

* Claude-powered agent understands natural language and executes RBTC transactions
* Tools: balance checks, RBTC sends, gas estimation, tx lookup, Zwick queries
* System prompt fine-tuned on RBTC transaction patterns
* Details in [aicore](aicore/README.md)

## Repository structure

```
MoneyOnRoot/
├── rbtccore/               # RSK/RBTC on-chain interaction
│   ├── connect.js          # Provider setup (RSK mainnet/testnet)
│   ├── balance.js          # RBTC and ERC-20 balance queries
│   ├── transaction.js      # Send RBTC, estimate gas, fetch tx
│   └── contracts/
│       ├── ZwickToken.sol  # Zwick ERC-20 stablecoin
│       └── deploy.js       # Deployment script
├── aicore/                 # Agentic AI layer
│   ├── agent.js            # Claude agent with tool use (REPL + single query)
│   ├── tools.js            # Tool definitions + implementations
│   └── finetune/
│       └── rbtc_dataset.jsonl  # Fine-tuning dataset for RBTC operations
└── apicore/                # External banking/fintech integration
```

## Use cases

* Trading with Zwick stablecoin
* DeFi applications on RSK that need USD-pegged tokens
* DEX swaps on the RSK ecosystem
* Bitcoin-backed micropayments
* AI-assisted RBTC payments via natural language

## Quick start

```bash
# 1. Install dependencies
cd rbtccore && npm install
cd ../aicore && npm install

# 2. Set environment
cp .env.example .env   # fill in ANTHROPIC_API_KEY, PRIVATE_KEY, etc.

# 3. Test RSK connection
cd rbtccore && npm run test-node

# 4. Launch AI agent
cd aicore && node agent.js
```
