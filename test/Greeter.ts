import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, waffle } from "hardhat";

import GreeterArtifact from "../artifacts/contracts/Greeter.sol/Greeter.json";

import { Greeter } from "../typechain/Greeter";
import { Signers } from "../types";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

const { deployContract } = waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Greeter", function () {
    beforeEach(async function () {
      const greeting: string = "Hello, world!";
      this.greeter = <Greeter>await deployContract(this.signers.admin, GreeterArtifact, [greeting]);
    });

    shouldBehaveLikeGreeter();
  });
});
