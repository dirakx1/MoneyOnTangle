/**
 * RBTC tool implementations for the MoneyOnRoot AI agent.
 * Each function maps to a Claude tool definition and performs
 * real on-chain queries via rbtccore.
 */
require('dotenv').config();
const path = require('path');
const { ethers } = require('ethers');

// Load rbtccore relative to this file
const rbtcRoot = path.join(__dirname, '..', 'rbtccore');
const { provider, networkConfig, getNodeInfo, getGasPrice } = require(rbtcRoot + '/connect');
const { getRbtcBalance, getTokenBalance } = require(rbtcRoot + '/balance');
const { sendRbtc, estimateGas, getTransaction } = require(rbtcRoot + '/transaction');

// ── Tool schemas (passed to Claude) ──────────────────────────────────────────

const TOOL_DEFINITIONS = [
  {
    name: 'get_rbtc_balance',
    description: 'Get the native RBTC balance of an RSK address.',
    input_schema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'RSK/Ethereum-style address (0x...)',
        },
      },
      required: ['address'],
    },
  },
  {
    name: 'send_rbtc',
    description:
      'Send RBTC (native RSK token, backed by Bitcoin) to a recipient address. ' +
      'Requires PRIVATE_KEY to be set in environment. Use for actual transfers.',
    input_schema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient RSK address (0x...)',
        },
        amount_rbtc: {
          type: 'string',
          description: 'Amount of RBTC to send (e.g. "0.001")',
        },
        memo: {
          type: 'string',
          description: 'Optional text memo stored in transaction calldata',
        },
      },
      required: ['to', 'amount_rbtc'],
    },
  },
  {
    name: 'estimate_gas',
    description: 'Estimate the gas cost for sending RBTC before submitting the transaction.',
    input_schema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient RSK address (0x...)',
        },
        amount_rbtc: {
          type: 'string',
          description: 'Amount of RBTC to send',
        },
        memo: {
          type: 'string',
          description: 'Optional memo to include',
        },
      },
      required: ['to', 'amount_rbtc'],
    },
  },
  {
    name: 'get_transaction',
    description: 'Fetch details of a transaction by its hash on the RSK network.',
    input_schema: {
      type: 'object',
      properties: {
        tx_hash: {
          type: 'string',
          description: 'Transaction hash (0x...)',
        },
      },
      required: ['tx_hash'],
    },
  },
  {
    name: 'get_network_status',
    description: 'Get the current status of the RSK network: block number, chain ID, gas price.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_token_balance',
    description: 'Get the Zwick (ZWK) or any ERC-20 token balance on RSK.',
    input_schema: {
      type: 'object',
      properties: {
        token_address: {
          type: 'string',
          description: 'Deployed ERC-20 contract address (0x...)',
        },
        wallet_address: {
          type: 'string',
          description: 'Wallet address to query',
        },
      },
      required: ['token_address', 'wallet_address'],
    },
  },
];

// ── Tool executor ─────────────────────────────────────────────────────────────

/**
 * Execute a tool by name with the given inputs.
 * @param {string} toolName
 * @param {object} inputs
 * @returns {Promise<string>} JSON-serialised result
 */
async function executeTool(toolName, inputs) {
  try {
    let result;

    switch (toolName) {
      case 'get_rbtc_balance': {
        result = await getRbtcBalance(inputs.address);
        result = {
          address: result.address,
          balance_rbtc: result.balanceRbtc,
          explorer: `${networkConfig.explorer}/address/${result.address}`,
        };
        break;
      }

      case 'send_rbtc': {
        result = await sendRbtc(inputs.to, inputs.amount_rbtc, inputs.memo || '');
        result = {
          hash: result.hash,
          from: result.from,
          to: result.to,
          amount_rbtc: result.value,
          block_number: result.blockNumber,
          explorer: `${networkConfig.explorer}/tx/${result.hash}`,
        };
        break;
      }

      case 'estimate_gas': {
        const est = await estimateGas(inputs.to, inputs.amount_rbtc, inputs.memo || '');
        result = {
          gas_limit: est.gasLimit.toString(),
          gas_price_gwei: est.gasPriceGwei,
          estimated_cost_rbtc: est.estimatedCostRbtc,
        };
        break;
      }

      case 'get_transaction': {
        result = await getTransaction(inputs.tx_hash);
        result = {
          ...result,
          explorer: `${networkConfig.explorer}/tx/${result.hash}`,
        };
        break;
      }

      case 'get_network_status': {
        const info = await getNodeInfo();
        const gasPrice = await getGasPrice();
        result = {
          network: networkConfig.name,
          chain_id: info.chainId.toString(),
          block_number: info.blockNumber,
          gas_price_gwei: gasPrice,
          explorer: networkConfig.explorer,
        };
        break;
      }

      case 'get_token_balance': {
        const bal = await getTokenBalance(inputs.token_address, inputs.wallet_address);
        result = {
          symbol: bal.symbol,
          balance: bal.balance,
          decimals: bal.decimals,
          wallet: inputs.wallet_address,
          token: inputs.token_address,
        };
        break;
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    return JSON.stringify(result, null, 2);
  } catch (err) {
    return JSON.stringify({ error: err.message });
  }
}

module.exports = { TOOL_DEFINITIONS, executeTool };
