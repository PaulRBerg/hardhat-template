import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";
import { HDAccountsConfig } from "@nomiclabs/buidler/types";
import "./tasks/accounts";
import "./tasks/clean";
import "./tasks/typechain";

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("solidity-coverage");

/**
 * @dev You must have a `.env` file. Follow the example in `.env.example`.
 * @param {string} network The name of the testnet
 */
function createNetworkConfig(network?: string): { accounts: HDAccountsConfig; url: string | undefined } {
  if (!process.env.MNEMONIC) {
    throw new Error("Please set your MNEMONIC in a .env file");
  }

  if (!process.env.INFURA_API_KEY) {
    throw new Error("Please set your INFURA_API_KEY");
  }

  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic: process.env.MNEMONIC,
      path: "m/44'/60'/0'/0",
    },
    url: network ? `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}` : undefined,
  };
}

const config: BuidlerConfig = {
  defaultNetwork: "buidlerevm",
  mocha: {
    /* Without this property set, the "setTimeout" from the Greeter.js file wouldn't work. */
    delay: true,
  },
  networks: {
    buidlerevm: {
      chainId: 31337,
    },
    coverage: {
      url: "http://127.0.0.1:8555",
    },
    goerli: {
      ...createNetworkConfig("goerli"),
      chainId: 5,
    },
    kovan: {
      ...createNetworkConfig("kovan"),
      chainId: 42,
    },
    rinkeby: {
      ...createNetworkConfig("rinkeby"),
      chainId: 4,
    },
    ropsten: {
      ...createNetworkConfig("ropsten"),
      chainId: 3,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    coverage: "./coverage",
    coverageJson: "./coverage.json",
    sources: "./contracts",
    tests: "./test",
  },
  solc: {
    /* https://buidler.dev/buidler-evm/#solidity-optimizer-support */
    optimizer: {
      enabled: false,
      runs: 200,
    },
    version: "0.5.12",
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
