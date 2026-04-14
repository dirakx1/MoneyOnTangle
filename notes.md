# MoneyOnRoot — Development Notes

## Original IOTA workflow (reference)
* Install wallet
* Create asset (colored coin/token), using available IOTA balance.
* Use cli-wallet to interact and learn about DA and colored coins.
* Install configure SC env.
* Define stablecoin smart contract

## Updated RSK/RBTC workflow

### Phase 1 — Network connection
* Connect to RSK testnet via `rbtccore/connect.js`
* Confirm block number and chain ID (31 = testnet, 30 = mainnet)

### Phase 2 — Wallet & balances
* Create/import RSK wallet (same key format as Ethereum, 0x...)
* Fund from RSK testnet faucet: https://faucet.rsk.co
* Check RBTC balance: `node rbtccore/balance.js 0xYourAddress`

### Phase 3 — Smart contract (Zwick stablecoin)
The smart contract is responsible for:
* Establishing the RBTC/USD equivalence via oracle
* Minting new Zwick tokens (1 ZWK = 1 USD)
* Transferring Zwick tokens between addresses
* `rbtcToZwick(weiAmount)` — converts RBTC to USD-pegged Zwick

Compile with: `cd rbtccore && npx hardhat compile`
Deploy with: `npm run deploy`

### Phase 4 — AI agent
* Set `ANTHROPIC_API_KEY` in `.env`
* Launch agent: `cd aicore && node agent.js`
* Agent tools: balance, send, estimate gas, tx lookup, token balance
* Fine-tuning dataset: `aicore/finetune/rbtc_dataset.jsonl`

### Phase 5 — Automation
* Use `aicore/agent.js` programmatically:
  ```js
  const { runAgentTurn } = require('./aicore/agent');
  await runAgentTurn('Send 0.001 RBTC to 0xabc for invoice #42', history);
  ```
