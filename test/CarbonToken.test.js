const { expect } = require("chai");

const { deployContract, toWei } = require("../utils/utils.js");

describe("CarbonToken", () => {
  let carbonToken;

  beforeEach(async () => {
    [owner, user, ...accounts] = await ethers.getSigners();

    carbonToken = await deployContract(owner, "CarbonToken");
  });

  describe("CarbonToken Deployment", async () => {
    it("has a name", async () => {
      const name = await carbonToken.name();
      expect(name).to.equal("CARBON");
    });

    it("has a symbol", async () => {
      const symbol = await carbonToken.symbol();
      expect(symbol).to.equal("CRB");
    });

    it("checks if owner has the tokens", async () => {
      const balance = await carbonToken.balanceOf(owner.address);
      expect(balance).to.equal(toWei("300000000"));
    });

    it("sends 100 tokens to user", async () => {
      await carbonToken.connect(owner).faucet(user.address, toWei("100"));
      expect(await carbonToken.balanceOf(user.address)).to.equal(toWei("100"));
    });
  });
});
