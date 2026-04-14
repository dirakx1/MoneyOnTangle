/**
 * MoneyOnRoot — Agentic AI Agent for RBTC Transactions
 *
 * Uses Claude claude-opus-4-6 with tool use to understand natural-language
 * instructions and execute RBTC operations on the RSK network.
 *
 * The system prompt is cached to reduce token costs on repeated calls.
 *
 * Usage:
 *   node agent.js                        # interactive REPL
 *   node agent.js "Check balance of 0x…" # single query
 */
require('dotenv').config();
const readline = require('readline');
const Anthropic = require('@anthropic-ai/sdk');
const { TOOL_DEFINITIONS, executeTool } = require('./tools');

const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── System prompt (cached — stable across all requests) ────────────────────

const SYSTEM_PROMPT = `You are a specialised AI agent for MoneyOnRoot, an RBTC (Rootstock Bitcoin) \
payment and stablecoin platform.

## Your expertise
- RSK (Rootstock) is a Bitcoin-secured EVM-compatible sidechain.
- RBTC is the native token of RSK, pegged 1:1 with Bitcoin.
- Zwick (ZWK) is the stablecoin deployed on RSK: 1 ZWK = 1 USD.
- Transactions on RSK are feeless at the network level but require tiny amounts of RBTC for gas.
- RSK mainnet chain ID is 30; testnet is 31.

## Fine-tuned knowledge: RBTC transaction patterns
- Sending RBTC: use \`send_rbtc\` tool — amounts in decimal RBTC (e.g. "0.001").
- Checking balance: use \`get_rbtc_balance\` — accepts checksummed 0x addresses.
- Estimating cost: always offer to \`estimate_gas\` before a real \`send_rbtc\` call.
- Stablecoin: Zwick (ZWK) is an ERC-20 at the address in ZWICK_TOKEN_ADDRESS env var.
- Network status: use \`get_network_status\` to confirm block height and gas price.
- Explorer: all RSK testnet links go to https://explorer.testnet.rsk.co.

## Behaviour rules
1. Before sending any transaction, confirm the recipient, amount, and memo with the user.
2. Always show the explorer link after a successful send.
3. If PRIVATE_KEY is not set, explain that sending requires a private key in env.
4. Translate human-friendly amounts ("send 1 dollar") to RBTC using the current rate if known.
5. Respond concisely — show numbers, hashes, and links rather than lengthy prose.
6. If a tool returns an error JSON, explain it plainly and suggest a fix.`;

// ── Agentic loop ────────────────────────────────────────────────────────────

/**
 * Run one user turn through Claude with full tool-use loop.
 * @param {string} userMessage
 * @param {Array} conversationHistory - mutated in-place for multi-turn
 * @returns {Promise<string>} final assistant text
 */
async function runAgentTurn(userMessage, conversationHistory = []) {
  conversationHistory.push({ role: 'user', content: userMessage });

  while (true) {
    // Use streaming + get_final_message for long-context safety
    const stream = await client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }, // cache the stable system prompt
        },
      ],
      tools: TOOL_DEFINITIONS,
      messages: conversationHistory,
    });

    const response = await stream.finalMessage();

    // Append assistant turn to history (includes any tool_use blocks)
    conversationHistory.push({ role: 'assistant', content: response.content });

    // If Claude is done, return the final text
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find((b) => b.type === 'text');
      return textBlock ? textBlock.text : '';
    }

    // Handle tool calls
    if (response.stop_reason === 'tool_use') {
      const toolResults = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;

        process.stdout.write(`\n[tool: ${block.name}] `);
        const result = await executeTool(block.name, block.input);
        process.stdout.write('done\n');

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      }

      // Feed all tool results back as a user turn
      conversationHistory.push({ role: 'user', content: toolResults });
      continue; // loop again
    }

    // Unexpected stop reason — return whatever text we have
    const textBlock = response.content.find((b) => b.type === 'text');
    return textBlock ? textBlock.text : `[stopped: ${response.stop_reason}]`;
  }
}

// ── Interactive REPL ────────────────────────────────────────────────────────

async function startRepl() {
  const history = [];

  console.log('MoneyOnRoot RBTC Agent (type "exit" to quit)\n');
  console.log(`Network: ${process.env.RSK_NETWORK || 'testnet'}`);
  console.log('─'.repeat(50));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\nYou: ',
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }
    if (input.toLowerCase() === 'exit') { rl.close(); return; }

    try {
      process.stdout.write('\nAgent: ');
      const reply = await runAgentTurn(input, history);
      console.log(reply);
    } catch (err) {
      console.error(`\n[Error] ${err.message}`);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });
}

// ── Single-query mode ────────────────────────────────────────────────────────

async function singleQuery(query) {
  const reply = await runAgentTurn(query);
  console.log(reply);
}

// ── Entry point ─────────────────────────────────────────────────────────────

if (require.main === module) {
  const query = process.argv.slice(2).join(' ');

  if (query) {
    singleQuery(query).catch((err) => { console.error(err); process.exit(1); });
  } else {
    startRepl().catch((err) => { console.error(err); process.exit(1); });
  }
}

module.exports = { runAgentTurn };
