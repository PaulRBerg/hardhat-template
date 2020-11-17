import { Signer } from "@ethersproject/abstract-signer";

export interface Accounts {
  admin: string;
}

export interface Signers {
  admin: Signer;
}
