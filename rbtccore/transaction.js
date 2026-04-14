/**
 * RBTC transaction handler for RSK network
 * Sends native RBTC with an optional memo encoded in calldata
 */
require('dotenv').config();
const { ethers } = require('ethers');
const { provider, networkConfig } = require('./connect');

/**
 * Build a Wallet from the private key in env.
 * @returns {ethers.Wallet}
 */
function getWallet() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error('PRIVATE_KEY not set in environment');
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Send RBTC to a recipient.
 * @param {string} toAddress - Recipient RSK address (0x...)
 * @param {string|number} amountRbtc - Amount in RBTC (e.g. "0.001")
 * @param {string} [memo] - Optional text memo stored as calldata
 * @returns {Promise<{hash: string, blockNumber: number, from: string, to: string, value: string}>}
 */
async function sendRbtc(toAddress, amountRbtc, memo = '') {
  const wallet = getWallet();
  const to = ethers.getAddress(toAddress);
  const value = ethers.parseEther(String(amountRbtc));

  const txParams = {
    to,
    value,
    data: memo ? ethers.hexlify(ethers.toUtf8Bytes(memo)) : '0x',
  };

  console.log(`Sending ${amountRbtc} RBTC to ${to}…`);
  const tx = await wallet.sendTransaction(txParams);
  console.log(`Transaction submitted: ${tx.hash}`);
  console.log(`Explorer: ${networkConfig.explorer}/tx/${tx.hash}`);

  const receipt = await tx.wait();
  console.log(`Confirmed in block: ${receipt.blockNumber}`);

  return {
    hash: tx.hash,
    blockNumber: receipt.blockNumber,
    from: wallet.address,
    to,
    value: amountRbtc,
  };
}

/**
 * Estimate gas for sending RBTC.
 * @param {string} toAddress - Recipient address
 * @param {string|number} amountRbtc - Amount in RBTC
 * @param {string} [memo] - Optional memo
 * @returns {Promise<{gasLimit: bigint, gasPriceGwei: string, estimatedCostRbtc: string}>}
 */
async function estimateGas(toAddress, amountRbtc, memo = '') {
  const wallet = getWallet();
  const to = ethers.getAddress(toAddress);
  const value = ethers.parseEther(String(amountRbtc));
  const data = memo ? ethers.hexlify(ethers.toUtf8Bytes(memo)) : '0x';

  const [gasLimit, feeData] = await Promise.all([
    provider.estimateGas({ from: wallet.address, to, value, data }),
    provider.getFeeData(),
  ]);

  const gasPrice = feeData.gasPrice || 0n;
  const gasPriceGwei = ethers.formatUnits(gasPrice, 'gwei');
  const estimatedCostRbtc = ethers.formatEther(gasLimit * gasPrice);

  return { gasLimit, gasPriceGwei, estimatedCostRbtc };
}

/**
 * Fetch a transaction and its receipt by hash.
 * @param {string} txHash - Transaction hash (0x...)
 * @returns {Promise<{hash: string, from: string, to: string, value: string, blockNumber: number|null, status: string}>}
 */
async function getTransaction(txHash) {
  const [tx, receipt] = await Promise.all([
    provider.getTransaction(txHash),
    provider.getTransactionReceipt(txHash),
  ]);

  if (!tx) throw new Error(`Transaction not found: ${txHash}`);

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: ethers.formatEther(tx.value),
    blockNumber: receipt ? receipt.blockNumber : null,
    status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending',
  };
}

module.exports = { sendRbtc, estimateGas, getTransaction, getWallet };

if (require.main === module) {
  const [to, amount, memo] = process.argv.slice(2);
  if (!to || !amount) {
    console.error('Usage: node transaction.js <to> <amount_rbtc> [memo]');
    process.exit(1);
  }
  sendRbtc(to, amount, memo).catch(console.error);
}
