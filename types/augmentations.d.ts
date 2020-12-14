import { Accounts, Signers } from "./";
import { Greeter } from "../typechain";

declare module "mocha" {
  export interface Context {
    accounts: Accounts;
    greeter: Greeter;
    signers: Signers;
  }
}
