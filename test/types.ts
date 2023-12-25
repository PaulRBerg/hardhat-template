import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

import type { Lock } from "../types/Lock";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    lock: Lock;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
