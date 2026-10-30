import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/types";

import type { Lock } from "../types/Lock.js";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    lock: Lock;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: HardhatEthersSigner;
}
