import { Accounts, Signers } from "./";
import { Greeter } from "../typechain/Greeter";

declare module "mocha" {
  export interface Context {
    accounts: Accounts;
    greeter: Greeter;
    signers: Signers;
  }
}
