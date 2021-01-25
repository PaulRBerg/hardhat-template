import { Signers } from "./";
import { Greeter } from "../typechain";

declare module "mocha" {
  export interface Context {
    greeter: Greeter;
    signers: Signers;
  }
}
