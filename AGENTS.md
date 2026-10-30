# Hardhat Template

## Toolchain

Use Bun for dependency installation and package scripts. Run Hardhat with a supported even-numbered Node.js release of
at least 22.13.0. CI uses Node.js 24.

Preserve both TypeScript aliases: `@typescript/native` supplies native TypeScript 7 `tsc`, while `typescript` supplies
the TypeScript 6 JavaScript API for ESLint and other tools. After dependency changes, verify
`bunx --no-install tsc --version` reports the native compiler.

## Generation and validation

Treat `artifacts/`, `cache/`, `coverage/`, `generated/` and `types/` as generated outputs. Run `bun run typechain`
before typechecking a fresh checkout. It builds contracts and generates both TypeChain bindings and Rocketh artifacts.

Validate changes with `bun install --frozen-lockfile`, `bun run lint`, `bun run typechain`,
`bunx --no-install tsc --noEmit`, `bun run test` and `bun run coverage`. Run the build before typechecking. Native
coverage writes its HTML report to `coverage/html/index.html`. Use `bun run test --gas-stats` for native gas statistics.

Keep Solidity pinned to 0.8.19 unless a requested change requires another compiler. Preserve the Lock event topics and
unlock-time boundary semantics. The two optional Solhint gas rules are disabled to preserve those semantics.

## TypeChain compatibility patch

Keep the Bun patch for `@nomicfoundation/hardhat-typechain@3.1.3` while its generated helper extends its own augmented
`HardhatEthersHelpers` interface. That self-inheritance causes TS2310. The patch removes the redundant inheritance and
preserves all generated overloads. When upgrading the plugin, remove the patch only after an unpatched rebuild and
strict native typecheck pass.

## Networks and deployments

Local builds, tests and simulated deployments need no credentials. Local accounts use Hardhat's public test mnemonic
unless `MNEMONIC` overrides it. Remote networks require `MNEMONIC`, and Infura-backed networks also require
`INFURA_API_KEY`. Verification requires `ETHERSCAN_API_KEY`. Keep these configuration variables lazy.

Use `rocketh/config.ts` for named accounts and deployment extensions. Keep deployment scripts in `deploy/`. For
successive commands against one local chain, run `bunx hardhat node` and select `--network localhost`. The default
simulated network creates a temporary chain for each command.
