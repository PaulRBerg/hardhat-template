import { Signer } from "@ethersproject/abstract-signer";
import { ethers, waffle } from "hardhat";

import GreeterArtifact from "../artifacts/contracts/Greeter.sol/Greeter.json";

import { Greeter } from "../typechain/Greeter";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

const { deployContract } = waffle;

setTimeout(async function () {
  const signers: Signer[] = await ethers.getSigners();
  const admin: Signer = signers[0];

  describe("Greeter", function () {
    beforeEach(async function () {
      const greeting: string = "Hello, world!";
      this.greeter = (await deployContract(admin, GreeterArtifact, [greeting])) as Greeter;
    });

    shouldBehaveLikeGreeter(signers);
  });

  run();
}, 1000);
