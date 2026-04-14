# AI Core — MoneyOnRoot

Agentic AI layer that understands natural-language commands and executes RBTC operations
on the RSK network using **Claude claude-opus-4-6** with tool use.

## Architecture

```
User → agent.js (Claude claude-opus-4-6 + adaptive thinking)
           ↓  tool calls
       tools.js  ←→  rbtccore/ (ethers.js + RSK RPC)
           ↓
       RSK Blockchain (chainId 30/31)
```

The agent uses:
- **Adaptive thinking** — Claude reasons through complex transaction requests
- **Prompt caching** — system prompt cached to cut costs on repeated calls
- **Tool use loop** — Claude calls tools as needed, loops until done

## Requirements

```
Node.js >= 18
ANTHROPIC_API_KEY set in environment
```

```bash
cd aicore
npm install
```

Copy `../.env.example` to `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
RSK_NETWORK=testnet
PRIVATE_KEY=0x...          # required for send_rbtc
WALLET_ADDRESS=0x...
ZWICK_TOKEN_ADDRESS=0x...  # ZwickToken contract address after deploy
```

## Usage

### Interactive REPL

```bash
node agent.js
```

```
MoneyOnRoot RBTC Agent (type "exit" to quit)
Network: testnet
──────────────────────────────────────────────────

You: What is my RBTC balance at 0xabc...?
[tool: get_rbtc_balance] done
Agent: Your RBTC balance is 0.05 RBTC (~$3,000)…

You: Send 0.001 RBTC to 0xdef... with memo "hello"
Agent: About to send 0.001 RBTC to 0xdef… Confirm? (YES/no)

You: YES
[tool: send_rbtc] done
Agent: Transaction confirmed! Hash: 0x…
```

### Single-query mode

```bash
node agent.js "Check the network status"
node agent.js "What is the Zwick stablecoin?"
node agent.js "Estimate gas to send 0.005 RBTC to 0xabc123"
```

## Tools available to the agent

| Tool | Description |
|------|-------------|
| `get_rbtc_balance` | RBTC balance for any address |
| `send_rbtc` | Send RBTC with optional memo |
| `estimate_gas` | Estimate gas cost before sending |
| `get_transaction` | Look up any tx by hash |
| `get_network_status` | Block number, chain ID, gas price |
| `get_token_balance` | ERC-20 (Zwick/ZWK) balance |

## Fine-tuning dataset

`finetune/rbtc_dataset.jsonl` contains 10 curated conversation examples
covering the most common RBTC operations. This JSONL can be used with
fine-tuning APIs to create a specialised RBTC transaction model:

```
- Balance queries
- RBTC sends with confirmation flow
- Gas estimation
- Transaction lookup
- Network status
- Stablecoin (Zwick) operations
- Testnet onboarding
```

The agent's system prompt already embeds this domain knowledge via prompt
engineering; the JSONL dataset is provided for additional fine-tuning
if/when Anthropic's fine-tuning API supports it.
