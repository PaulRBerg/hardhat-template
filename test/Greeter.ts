/* eslint-disable func-names */
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { Greeter } from "../typechain";

import { Accounts, Signers } from "../types";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";

const setup = deployments.createFixture(async () => {
  await deployments.fixture();
  const greeter = (await ethers.getContract("Greeter")) as Greeter;

  return {
    greeter,
  };
});

describe("Unit tests", function () {
  before(async function () {
    const accounts = await getNamedAccounts();
    const signers = await ethers.getNamedSigners();
    this.accounts = (accounts as unknown) as Accounts;
    this.signers = (signers as unknown) as Signers;
  });

  describe("Greeter", function () {
    beforeEach(async function () {
      const { greeter } = await setup();
      this.greeter = greeter;
    });

    shouldBehaveLikeGreeter();
  });
});
