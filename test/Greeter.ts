import { Signer } from "@ethersproject/abstract-signer";
import { ethers, waffle } from "@nomiclabs/buidler";

import GreeterArtifact from "../artifacts/Greeter.json";

import { Greeter } from "../typechain/Greeter";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

const { createFixtureLoader, deployContract } = waffle;

async function greeterFixture(signers: Signer[]): Promise<{ greeter: Greeter }> {
  const greeter: Greeter = (await deployContract(signers[0], GreeterArtifact, ["Hello, world!"])) as Greeter;
  return { greeter };
}

setTimeout(async function () {
  const signers: Signer[] = await ethers.getSigners();

  describe("Greeter", function () {
    beforeEach(async function () {
      /**
       * You can replace "waffle.provider.getWallets" with "ethers.getSigners()" - the bug persists.
       */
      const { greeter } = await createFixtureLoader(await waffle.provider.getWallets())(greeterFixture);
      this.greeter = greeter;
    });

    shouldBehaveLikeGreeter(signers);
  });

  run();
}, 1000);
