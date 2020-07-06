import chai from "chai";
import { Wallet } from "@ethersproject/wallet";
import { deployContract, solidity } from "ethereum-waffle";
import { ethers, waffle } from "@nomiclabs/buidler";

import GreeterArtifact from "../artifacts/Greeter.json";

import { Greeter } from "../typechain/Greeter";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

chai.use(solidity);

setTimeout(async function () {
  const wallets = (await ethers.getSigners()) as Wallet[];

  describe("Greeter", function () {
    beforeEach(async function () {
      const greeting: string = "Hello, world!";
      this.greeter = (await deployContract(wallets[0], GreeterArtifact, [greeting])) as Greeter;
    });

    shouldBehaveLikeGreeter(wallets);
  });

  run();
}, 1000);
