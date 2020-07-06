import { Greeter } from "../typechain/Greeter";

declare module "mocha" {
  export interface Context {
    greeter: Greeter;
  }
}
