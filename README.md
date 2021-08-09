# Hardhat Starterkit Template (JavaScript)

#### Inspiration - [Solidity Template](https://github.com/paulrberg/solidity-template)

- [Hardhat](https://github.com/nomiclabs/hardhat): compile and run the smart contracts on a local development network
- [Ethers](https://github.com/ethers-io/ethers.js/): Ethereum library and wallet implementation
- [Web3js](https://github.com/ChainSafe/web3.js): Ethereum library and wallet implementation
- [Waffle](https://github.com/EthWorks/Waffle): tooling for writing comprehensive smart contract tests
- [Solhint](https://github.com/protofire/solhint): linter
- [Solcover](https://github.com/sc-forks/solidity-coverage): code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter

This is a GitHub template, which means you can reuse it as many times as you want. You can do that by clicking the "Use this
template" button at the top of the page.

## Usage

### Pre Requisites

Before running any command, you need to create a `.env` file and set all necassary environment variables.
Follow the example in `.env.example`. If you don't already have a private key, use this [website](https://vanity-eth.tk/) to generate one.

Then, proceed with installing dependencies:

```sh
yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```
### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call by setting `true` as the value for property `enabled` in `gasReporter` object.
Optional:

- See the actual fiat currency rates by setting your coingecko api key from [here](https://coinmarketcap.com/api/pricing/) in `.env` file or command.

- Set custom gas price (gwei) in `.env` file or command or let it automatically fetched by ethgasstationapi.

```sh
$ GAS_PRICE=20
$ COIN_MARKET_CAP_API_KEY=
$ yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy
```

Deploy the contracts to a specific network, such as the Rinkeby testnet:

```sh
$ yarn deploy:network rinkeby
```

### Manual Verify

This helps you verify the source code for your Solidity contracts on [etherscan](https://etherscan.io/) or [bscscan](https://bscscan.com/)

```sh
$ npx hardhat verify --network <network> DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 2"
```

For complex arguments you can refer [here](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html)

```sh
$ npx hardhat verify --contract contracts/CONTRACT_NAME.sol:CONTRACT_NAME --network <network> --constructor-args arguments/FILENAME.js DEPLOYED_CONTRACT_ADDRESS
```

### Auto Deploy and Verify (using a single command)

Deploy and automatically verify the contract using deploy script, this is possible by using `child_process` within the script which lets you
run commands within the .js file. Every time we need to verify a contract we need to set the arguments that we passed in the constructor of contract 
in the command or create an argument file and export it but now all this can be done automatically by using the `verifyContract` function in 
the `utils/utils.js` file. An example deploy script is attached for reference.
As of now it works on Etherscan and Bscscan, you must provide it's api key in `.env` file. (Enable one at a time and comment other).
You can get the api key by loging in to respective explorer.
Specify the correct network in the script and run this command with same network specified in the `hardhat.config.js`. e.g. rinkeby 
Or run any script using

```sh
$ yarn deploy:network rinkeby
$ npx hardhat run scripts/path_to_script --network rinkeby
```

### Tasks

#### flatfile

We often need to flatten our code for verification purposes or any other but the existing default `flatten` task requires manual copy-paste from terminal
and creation of whatever file extension we want but we can automate the creation of the flatten file by using a new `flatfile` task and providing the
contract name with `--contract` flag

```sh
$ npx hardhat flatfile --contract CONTRACT_NAME
$ yarn flatfile:contract CONTRACT_NAME
```

where, `CONTRACT_NAME` can be for example `TestingContract`

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the
[vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) extension. The recommended approach to set the
compiler version is to add the following fields to your VSCode user settings or in workspace settings json file:

```json
{
  "solidity.compileUsingRemoteVersion": "v0.8.4+commit.c7e474f2",
  "solidity.defaultCompiler": "remote"
}
```

Where of course `v0.8.4+commit.c7e474f2` can be replaced with any other version.
