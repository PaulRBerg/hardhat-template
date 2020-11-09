import { Greeter } from "../typechain/Greeter";

declare module "hardhat/types" {
  interface ProjectPaths {
    // coverage: string;
    // coverageJson: string;
  }
}

declare module "mocha" {
  export interface Context {
    greeter: Greeter;
  }
}
