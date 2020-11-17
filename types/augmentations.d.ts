import { Accounts, Signers } from "./";
import { Greeter } from "../typechain/Greeter";

declare module "hardhat/types" {
  interface ProjectPathsUserConfig {
    coverage: string;
    coverageJson: string;
  }
}

declare module "mocha" {
  export interface Context {
    accounts: Accounts;
    greeter: Greeter;
    signers: Signers;
  }
}
