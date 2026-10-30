import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatDeploy from "hardhat-deploy";
import { configVariable, defineConfig } from "hardhat/config";
import type { HttpNetworkUserConfig } from "hardhat/types/config";

import accounts from "./tasks/accounts.js";
import { deployLock, withdraw } from "./tasks/lock.js";

const mnemonic = configVariable("MNEMONIC");
const localAccounts = {
  mnemonic: configVariable("MNEMONIC", { default: "test test test test test test test test test test test junk" }),
};
const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  mainnet: 1,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  sepolia: 11155111,
};

function getChainConfig(chain: keyof typeof chainIds): HttpNetworkUserConfig {
  let url: HttpNetworkUserConfig["url"];
  switch (chain) {
    case "avalanche":
      url = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "bsc":
      url = "https://bsc-dataseed1.binance.org";
      break;
    default:
      url = configVariable("INFURA_API_KEY", { format: `https://${chain}.infura.io/v3/{variable}` });
  }
  return {
    type: "http",
    accounts: { count: 10, mnemonic, path: "m/44'/60'/0'/0" },
    chainId: chainIds[chain],
    url,
  };
}

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers, hardhatDeploy],
  tasks: [accounts, deployLock, withdraw],
  verify: {
    etherscan: { apiKey: configVariable("ETHERSCAN_API_KEY") },
  },
  networks: {
    default: { type: "edr-simulated", chainType: "l1", chainId: 31337, accounts: localAccounts },
    hardhat: { type: "edr-simulated", chainType: "l1", chainId: 31337, accounts: localAccounts },
    ganache: { type: "http", accounts: { mnemonic }, chainId: 1337, url: "http://localhost:8545" },
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism-mainnet"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
    sepolia: getChainConfig("sepolia"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: { mocha: "./test" },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      optimizer: { enabled: true, runs: 800 },
    },
  },
  typechain: { outDir: "types" },
  generateTypedArtifacts: { destinations: [{ mode: "typescript", folder: "./generated" }] },
});
