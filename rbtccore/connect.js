/**
 * RSK (Rootstock) network connection for MoneyOnRoot
 * RBTC is Bitcoin on the RSK sidechain — EVM-compatible, Chain ID 30/31
 */
require('dotenv').config();
const { ethers } = require('ethers');

const RSK_NETWORKS = {
  mainnet: {
    rpc: 'https://public-node.rsk.co',
    chainId: 30,
    explorer: 'https://explorer.rsk.co',
    name: 'rsk-mainnet',
  },
  testnet: {
    rpc: 'https://public-node.testnet.rsk.co',
    chainId: 31,
    explorer: 'https://explorer.testnet.rsk.co',
    name: 'rsk-testnet',
  },
};

const networkName = process.env.RSK_NETWORK || 'testnet';
const networkConfig = RSK_NETWORKS[networkName];

if (!networkConfig) {
  throw new Error(`Unknown RSK network: ${networkName}. Use 'mainnet' or 'testnet'.`);
}

const provider = new ethers.JsonRpcProvider(networkConfig.rpc, {
  chainId: networkConfig.chainId,
  name: networkConfig.name,
});

/**
 * Retrieve basic information about the connected RSK node.
 * @returns {Promise<{blockNumber: number, chainId: bigint, network: string}>}
 */
async function getNodeInfo() {
  const [blockNumber, network] = await Promise.all([
    provider.getBlockNumber(),
    provider.getNetwork(),
  ]);

  const info = {
    blockNumber,
    chainId: network.chainId,
    networkName: networkConfig.name,
    explorer: networkConfig.explorer,
  };

  console.log(`Connected to RSK ${networkName}`);
  console.log(`Block number: ${blockNumber}`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log(`Explorer: ${networkConfig.explorer}`);

  return info;
}

/**
 * Get a gas price estimate from the network.
 * @returns {Promise<string>} Gas price in gwei
 */
async function getGasPrice() {
  const feeData = await provider.getFeeData();
  const gasPriceGwei = ethers.formatUnits(feeData.gasPrice || 0n, 'gwei');
  return gasPriceGwei;
}

module.exports = { provider, networkConfig, networkName, getNodeInfo, getGasPrice };

if (require.main === module) {
  getNodeInfo().catch(console.error);
}
