# Hardhat Template [![Open in Gitpod][gitpod-badge]][gitpod] [![Github Actions][gha-badge]][gha] [![Hardhat][hardhat-badge]][hardhat] [![License: MIT][license-badge]][license]

[gitpod]: https://gitpod.io/#https://github.com/paulrberg/hardhat-template
[gitpod-badge]: https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-FFB45B?logo=gitpod
[gha]: https://github.com/paulrberg/hardhat-template/actions
[gha-badge]: https://github.com/paulrberg/hardhat-template/actions/workflows/ci.yml/badge.svg
[hardhat]: https://hardhat.org/
[hardhat-badge]: https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

A Hardhat-based & Foundry-based template for developing upgradeable Solidity smart contracts, with sensible defaults.

This is also my personal opinionated solution on the following tricky problems:

- foundry integrated with hardhat without manually copying solidity lib from source (but with npm)
  - overall, foundry is much faster than hardhat test & allowed me to write cleaner tests
  - but it's trivial process to integrate the foundry contracts
    - this extended template will do the remapping, which will allow hardhat to resolve files by foundry and also allow
      foundry to resolve files downloaded by npm
- testing with soldity using foundry
  - it covers the following features with foundry:
    - fixure
    - storage manipulation (used to minting unlimited erc20 token)
    - EOA impersonation
    - time-based testing (commented somewhere)
    - assertion
    - expect on revert
    - fuzz input (property test)
- reproducable deployment for frontend using hardhat-deploy
  - generate a file that maps network name & address which frontend could be used
- upgradeable contracts using proxy
  - using `@openzeppeplin/contract-upgradable`
  - use `initialize()` to bootstrap arguments instead of constructor
    - security reason why we should use the library instead of writing our own:
      - library provides `initialize` modifier that ensure us to initialize after deployment
      - it can make sure `initialize` wouldn't be called again
- scripts to upgrade the contract

This is a template WIP, here are some of my to-dos:

- Github Action with Foundry
- Using external artifacts that already exists but not in npm registry

## Libray used

- [Hardhat](https://github.com/nomiclabs/hardhat): compile, run and test smart contracts
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript bindings for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Solhint](https://github.com/protofire/solhint): code linter
- [Solcover](https://github.com/sc-forks/solidity-coverage): code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter
- [Foundry](https://github.com/foundry-rs/foundry): a framework that allows testing in Solidity
- [hardhat-deploy](https://github.com/wighawag/hardhat-deploy): for replicable deployment, associate name to address

## Feature introduction

This repo include two version of `Vault` which user could deposit ETH (which will be wrapped as WETH) or ERC20 Token:

- first version only allow deposit
- second version will also allow withdraw

## Getting Started

Click the [`Use this template`](https://github.com/paulrberg/hardhat-template/generate) button at the top of the page to
create a new repository with this repo as the initial state.

## Features

This template builds upon the frameworks and libraries mentioned above, so for details about their specific features,
please consult their respective documentations.

For example, for Hardhat, you can refer to the [Hardhat Tutorial](https://hardhat.org/tutorial) and the
[Hardhat Docs](https://hardhat.org/docs). You might be in particular interested in reading the
[Testing Contracts](https://hardhat.org/tutorial/testing-contracts) section.

### Sensible Defaults

This template comes with sensible default configurations in the following files:

```text
├── .commitlintrc.yml
├── .editorconfig
├── .eslintignore
├── .eslintrc.yml
├── .gitignore
├── .prettierignore
├── .prettierrc.yml
├── .solcover.js
├── .solhintignore
├── .solhint.json
├── .yarnrc.yml
├── foundry.toml
└── hardhat.config.ts
```

### GitHub Actions

This template comes with GitHub Actions pre-configured. Your contracts will be linted and tested on every push and pull
request made to the `main` branch.

Note though that to make this work, you must use your `INFURA_API_KEY` and your `MNEMONIC` as GitHub secrets.

You can edit the CI script in [.github/workflows/ci.yml](./.github/workflows/ci.yml).

### Conventional Commits

This template enforces the [Conventional Commits](https://www.conventionalcommits.org/) standard for git commit
messages. This is a lightweight convention that creates an explicit commit history, which makes it easier to write
automated tools on top of.

### Git Hooks

This template uses [Husky](https://github.com/typicode/husky) to run automated checks on commit messages, and
[Lint Staged](https://github.com/okonet/lint-staged) to automatically format the code with Prettier when making a git
commit.

## Usage

### Pre Requisites

Before being able to run any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an
environment variable. You can follow the example in `.env.example`. If you don't already have a mnemonic, you can use
this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
$ yarn install
```

Make sure you have `forge` installed as well, which is very easy:
[website](https://book.getfoundry.sh/getting-started/installation)

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain bindings:

```sh
$ yarn typechain
```

### Test

Run the tests with Forge of contract logic:

(If this doesn't work, make sure you called `yarn clean` to do the remapping of foundry and hardhat first)

```sh
$ forge test --fork-url <MAINNET_URL>
```

Run the tests with proxy upgrade logic:

```sh
$ yarn test
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ forge test --fork-url <MAINNET_URL> --report-gas
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

**Make sure to call this if there is any library & dependency change**

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy --greeting "Bonjour, le monde!"
```

## Tips

### Syntax Highlighting

If you use VSCode, you can get Solidity syntax highlighting with the
[hardhat-solidity](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) extension.

## Using GitPod

[GitPod](https://www.gitpod.io/) is an open-source developer platform for remote development.

To view the coverage report generated by `yarn coverage`, just click `Go Live` from the status bar to turn the server
on/off.

## License

[MIT](./LICENSE.md) © Paul Razvan Berg
