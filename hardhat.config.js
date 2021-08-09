/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
// for web3 and truffle compatibility
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-truffle5");
// verify contract on etherscan
require("@nomiclabs/hardhat-etherscan");
// for exporting abi in separate file
require("hardhat-abi-exporter");
// sol coverage
require("solidity-coverage");
// hardhat contract sizer
require("hardhat-contract-sizer");
// hardhat gas reporter (uncomment to enable)
require("hardhat-gas-reporter");
// A plugin that brings OVM compiler support to Hardhat projects.
require("@eth-optimism/plugins/hardhat/compiler");

// require tasks
require("./tasks/accounts");
require("./tasks/flatfile");

const infuraUrl = (network) =>
  `https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

const alchemyUrl = (network) =>
  `https://${network}.g.alchemy.com/v2/${process.env.ALCHEMY_PROJECT_ID}-_s`;

const networks = {
  arb: {
    chainId: 42161,
    url: alchemyUrl("arb-mainnet"),
  },
  arbrinkeby: {
    chainId: 421611,
    url: alchemyUrl("arb-rinkeby"),
  },
  bnb: { chainId: 56, url: process.env.BSC_MAINNET_RPC_URL },
  bnbt: { chainId: 97, url: process.env.BSC_TESTNET_RPC_URL },
  ganache: { chainId: 1337, url: "http://127.0.0.1:7545" },
  goerli: { chainId: 5, url: infuraUrl("goerli") },
  hardhat: { chainId: 31337 },
  kovan: { chainId: 42, url: infuraUrl("kovan") },
  mainnet: { chainId: 1, url: infuraUrl("mainnet") },
  matic: {
    chainId: 137,
    url: alchemyUrl("polygon-mainnet"),
  },
  maticmum: {
    chainId: 80001,
    url: alchemyUrl("polygon-mumbai"),
  },
  optimism: {
    chainId: 10,
    url: "https://mainnet.optimism.io/",
  },
  optimismkovan: {
    chainId: 69,
    url: "https://kovan.optimism.io",
  },
  rinkeby: { chainId: 4, url: infuraUrl("rinkeby") },
  ropsten: { chainId: 3, url: infuraUrl("ropsten") },
};

// can add as many private keys as you want
const accounts = [
  `0x${process.env.PRIVATE_KEY_1}`,
  // `0x${process.env.PRIVATE_KEY_2}`,
  // `0x${process.env.PRIVATE_KEY_3}`,
  // `0x${process.env.PRIVATE_KEY_4}`,
  // `0x${process.env.PRIVATE_KEY_5}`,
];

function getChainConfig(network) {
  return {
    accounts,
    chainId: networks[network].chainId,
    from: accounts[0],
    url: networks[network].url,
  };
}

const contractSizer = () =>
  process.env.CONTRACT_SIZER
    ? {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
      }
    : null;

module.exports = {
  abiExporter: {
    path: "./abi_exporter",
    clear: true,
    flat: true,
    // only: [':ERC20$'],
    spacing: 2,
  },
  contractSizer,
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey:
      process.env.ETHERSCAN_API_KEY || process.env.BSCSCAN_API_KEY || null,
  },
  gasReporter: {
    enabled: true, // set false to disable
    // enabled: process.env.REPORT_GAS ? true : false, // this is not working as of now
    currency: "USD",
    // if commented out then it fetches from ethGasStationAPI
    // gasPrice: process.env.GAS_PRICE,
    coinmarketcap: process.env.COIN_MARKET_CAP_API_KEY || null,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: networks["hardhat"].chainId,
    },
    ganache: {
      chainId: networks["ganache"].chainId,
      url: networks["ganache"].url,
    },

    /* ETHEREUM */
    mainnet: getChainConfig("mainnet"),
    ropsten: getChainConfig("ropsten"),
    rinkeby: getChainConfig("rinkeby"),
    goerli: getChainConfig("goerli"),

    /* BINANCE SMART CHAIN */
    bnb: getChainConfig("bnb"),
    bnbt: getChainConfig("bnbt"),

    /* MATIC L2 */
    matic: getChainConfig("matic"),
    maticmum: getChainConfig("maticmum"),

    /* ARBITRUM L2 */
    arb: getChainConfig("arb"),
    arbrinkeby: getChainConfig("arbrinkeby"),

    /* OPTIMISM L2 */
    optimism: getChainConfig("optimism"),
    optimismkovan: getChainConfig("optimismkovan"),
  },
  ovm: {
    solcVersion: "0.8.4", // Your version goes here.
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
