# Hardhat Template [![Open in Gitpod][gitpod-badge]][gitpod] [![Github Actions][gha-badge]][gha] [![Hardhat][hardhat-badge]][hardhat] [![License: MIT][license-badge]][license]

[gitpod]: https://gitpod.io/#https://github.com/paulrberg/hardhat-template
[gitpod-badge]: https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-FFB45B?logo=gitpod
[gha]: https://github.com/paulrberg/hardhat-template/actions
[gha-badge]: https://github.com/paulrberg/hardhat-template/actions/workflows/ci.yml/badge.svg
[hardhat]: https://hardhat.org/
[hardhat-badge]: https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

A Hardhat-based template for developing Solidity smart contracts, with sensible defaults.

- [Hardhat](https://github.com/NomicFoundation/hardhat): compile, run and test smart contracts
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript bindings for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Solhint](https://github.com/protofire/solhint): code linter
- [Hardhat coverage](https://hardhat.org/docs/guides/testing/code-coverage): native code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter

## Getting Started

Click the [`Use this template`](https://github.com/paulrberg/hardhat-template/generate) button at the top of the page to
create a new repository with this repo as the initial state.

## Features

This template builds upon the frameworks and libraries mentioned above, so for details about their specific features,
please consult their respective documentations.

For example, for Hardhat, you can refer to the [Hardhat Tutorial](https://hardhat.org/docs/tutorial) and the
[Hardhat Docs](https://hardhat.org/docs). You might be in particular interested in reading the
[Testing Contracts](https://hardhat.org/docs/guides/testing) section.

### Sensible Defaults

This template comes with sensible default configurations in the following files:

```text
├── .editorconfig
├── .gitignore
├── .prettierignore
├── .prettierrc.yml
├── .solhint.json
├── eslint.config.mjs
├── hardhat.config.ts
└── rocketh/config.ts
```

### VSCode Integration

This template is IDE agnostic, but for the best user experience, you may want to use it in VSCode alongside Nomic
Foundation's [Solidity extension](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity).

### GitHub Actions

This template comes with GitHub Actions pre-configured. Your contracts will be linted and tested on every push and pull
request made to the `main` branch.

Note that by default, the CI uses test values for `MNEMONIC` and `INFURA_API_KEY`. If you want to use your own values,
you can set them as GitHub secrets.

For more information on how to set up GitHub secrets, check out the
[docs](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).

You can edit the CI script in [.github/workflows/ci.yml](./.github/workflows/ci.yml).

## Usage

### Prerequisites

Use a supported even-numbered Node.js release, at least 22.13.0 (CI uses Node.js 24), and Bun. Install the dependencies:

```sh
bun install
```

Local compilation, tests and simulated deployments work without credentials. The local network uses Hardhat's public
test mnemonic by default. Set `MNEMONIC` to use different local accounts.

For remote networks, provide `MNEMONIC` and, for Infura-backed networks, `INFURA_API_KEY` through environment variables
or the [Hardhat keystore](https://hardhat.org/docs/guides/configuration-variables). For example:

```sh
bunx hardhat keystore set MNEMONIC
bunx hardhat keystore set INFURA_API_KEY
```

Set `ETHERSCAN_API_KEY` when verifying contracts. Configuration variables resolve only when the selected operation needs
them.

See [AGENTS.md](./AGENTS.md) for contributor guidance and toolchain constraints.

### Compile

Compile the smart contracts with Hardhat:

```sh
bun run compile
```

### TypeChain

Compile the smart contracts and generate TypeChain bindings:

```sh
bun run typechain
```

### Test

Run the tests with Hardhat:

```sh
bun run test
```

### Lint Solidity

Lint the Solidity code:

```sh
bun run lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
bun run lint:ts
```

### Coverage

Generate the native code coverage report in `coverage/html/index.html`:

```sh
bun run coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
bun run test --gas-stats
```

### Clean

Clear the smart contract artifacts, coverage reports and Hardhat cache, then rebuild the contracts and TypeChain
bindings:

```sh
bun run clean
```

### Deploy

Deploy the contracts to the temporary simulated Hardhat network with hardhat-deploy and Rocketh:

```sh
bun run deploy:contracts
```

Named accounts and deployment extensions live in `rocketh/config.ts`. Deployment scripts live in `deploy/`. To persist
contracts on a running local node or deploy remotely, pass `--network localhost` or the configured network name.

### Tasks

#### Deploy Lock

Deploy a new instance of the Lock contract via a task:

```sh
bun run task:deployLock --unlock 100 --value 0.1
```

#### Withdraw

Withdraw from a deployed Lock after its unlock time:

```sh
bun run task:withdraw --network localhost --account 0 --address <lock-address>
```

Omit `--address` to use the saved `Lock` deployment for the selected network.

### Syntax Highlighting

If you use VSCode, you can get Solidity syntax highlighting with the
[hardhat-solidity](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) extension.

## Using GitPod

[GitPod](https://www.gitpod.io/) is an open-source developer platform for remote development.

To view the coverage report generated by `bun run coverage`, just click `Go Live` from the status bar to turn the server
on/off.

## Local development

Start a persistent Hardhat node:

```sh
bunx hardhat node
```

In another terminal, deploy to that node:

```sh
bun run deploy:contracts --network localhost
```

Use `--network localhost` for subsequent tasks so they connect to the same chain. The default network creates a
temporary chain for each command.

## License

This project is licensed under MIT.
