# Introducing Zwick (ZWK)

* RSK Stablecoin — deployed on the Rootstock Bitcoin sidechain
* 1 ZWK = 1 USD
* ERC-20 contract: `ZwickToken.sol` in `rbtccore/contracts/`

## How it works

| Component | Description |
|-----------|-------------|
| Smart contract | ERC-20 on RSK (EVM-compatible) |
| Peg mechanism | Oracle-reported RBTC/USD rate |
| Minting | Owner calls `mint(address, amount)` |
| Burning | Holders call `burn(amount)` |
| Rate conversion | `rbtcToZwick(weiAmount)` returns ZWK equivalent |

## Workflow

1. Deploy `ZwickToken.sol` to RSK testnet via `rbtccore/contracts/deploy.js`
2. Set the oracle address and initial RBTC/USD rate
3. Mint Zwick to initial holders
4. Use the AI agent (`aicore/agent.js`) to transfer Zwick with natural language

## Agent integration

The AI agent can query Zwick balances and guide users through token operations:

```
node aicore/agent.js "Check my Zwick balance at 0x…"
node aicore/agent.js "How many ZWK is 0.001 RBTC worth right now?"
```

## Original concept

Initial workflow and smart contract plan: see [notes.md](notes.md)
