import { Signer } from "@ethersproject/abstract-signer";
import { ethers, waffle } from "hardhat";

import { Accounts, Signers } from "../types";
import { Greeter__factory } from "../typechain";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

const { deployContract } = waffle;

describe("Unit tests", function () {
  before(async function () {
    this.accounts = {} as Accounts;
    this.signers = {} as Signers;

    const signers: Signer[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.accounts.admin = await signers[0].getAddress();
  });

  describe("Greeter", function () {
    beforeEach(async function () {
      const greeting: string = "Hello, world!";
      this.greeter = await new Greeter__factory(this.signers.admin).deploy(greeting);
    });

    shouldBehaveLikeGreeter();
  });
});
