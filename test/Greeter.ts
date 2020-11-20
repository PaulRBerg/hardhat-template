import { deployments, ethers, getNamedAccounts } from "hardhat";

import { Accounts } from "../types";
import { Greeter } from "../typechain/Greeter";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

const setup = deployments.createFixture(async () => {
  await deployments.fixture();
  const greeter = await ethers.getContract("Greeter") as Greeter;

  return {
    greeter
  };
});

describe("Unit tests", function () {
  before(async function () {
    const accounts = await getNamedAccounts()
    this.accounts = accounts as unknown as Accounts;
  });

  describe("Greeter", function () {
    beforeEach(async function () {
      const { greeter } = await setup()
      this.greeter = greeter;
    });

    shouldBehaveLikeGreeter();
  });
});
