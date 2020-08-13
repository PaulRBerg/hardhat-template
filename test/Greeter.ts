import chai from "chai";
import { Signer } from "@ethersproject/abstract-signer";
import { deployContract, solidity } from "ethereum-waffle";
import { ethers } from "@nomiclabs/buidler";

import GreeterArtifact from "../artifacts/Greeter.json";

import { Greeter } from "../typechain/Greeter";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

chai.use(solidity);

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
