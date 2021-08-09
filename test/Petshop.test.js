const Petshop = artifacts.require("Petshop");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

function toWei(n) {
  return web3.utils.toWei(n, "ether");
}

function FromWei(n) {
  return web3.utils.fromWei(n, "ether").toString();
}

contract("Petshop", ([owner, ...accounts]) => {
  let petshop;

  before(async () => {
    petshop = await Petshop.new("Petshop", "PET", "", { from: owner });
  });

  describe("check name and symbol", () => {
    it("check name", async () => {
      const name = await petshop.name();
      assert.equal(name.toString(), "Petshop");
    });

    it("check symbol", async () => {
      const symbol = await petshop.symbol();
      assert.equal(symbol.toString(), "PET");
    });
  });

  describe("owner creates Pets for himself", () => {
    it("creates first pet", async () => {
      await petshop.createPet(owner, toWei("0.001"), "", { from: owner });
      const ownerOfPet = await petshop.ownerOf("1");
      assert.equal(ownerOfPet.toString(), owner);
    });

    it("creates four pets and deletes one", async () => {
      await petshop.createPet(owner, toWei("0.01"), "", { from: owner });
      await petshop.createPet(owner, toWei("0.0001"), "", { from: owner });
      await petshop.createPet(owner, toWei("0.001"), "", { from: owner });
      await petshop.createPet(owner, toWei("0.002"), "", { from: owner });
      await petshop.createPet(owner, toWei("0.004"), "", { from: owner });

      const ownerOfPet = await petshop.ownerOf("4");
      assert.equal(ownerOfPet.toString(), owner);

      await petshop.deletePet("5", { from: owner });
      await truffleAssert.reverts(
        petshop.ownerOf("5"),
        "ERC721: owner query for nonexistent token"
      );
    });

    it("should fail calling nonexistent token", async () => {
      await truffleAssert.reverts(
        petshop.ownerOf("0"),
        "ERC721: owner query for nonexistent token"
      );
    });

    it("should fail creating pet by non-owner", async () => {
      await truffleAssert.reverts(
        petshop.createPet(accounts[0], toWei("0.001"), "", {
          from: accounts[0],
        }),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("user buys pet", () => {
    it("allows first user to buy pet", async () => {
      await petshop.createPet(owner, toWei("0.001"), "", { from: owner });
      await petshop.buyPet("1", { from: accounts[0], value: toWei("0.001") });
      const ownerOfPet = await petshop.ownerOf("1");
      assert.equal(ownerOfPet.toString(), accounts[0]);
    });

    it("should fail calling with insufficient value", async () => {
      await petshop.createPet(owner, toWei("0.001"), "", { from: owner });
      await truffleAssert.reverts(
        petshop.buyPet("2", {
          from: accounts[0],
          value: toWei("0.0001"),
        }),
        "Petshop: Provide valid price for pet"
      );
    });
  });

  describe("owner creates pet for account[0]", () => {
    it("should create pet with tokenId 1 for account[0]", async () => {
      await petshop.createPet(accounts[0], toWei("0.01"), "", {
        from: owner,
      });
      const ownerOfPet = await petshop.ownerOf("1");
      assert.equal(ownerOfPet.toString(), accounts[0]);
    });

    it("should let account[0] change his pet price", async () => {
      await petshop.changePetPrice("1", toWei("0.001"), { from: accounts[0] });

      await petshop.buyPet("1", { from: accounts[1], value: toWei("0.001") });

      const ownerOfPet = await petshop.ownerOf("1");
      assert.equal(ownerOfPet.toString(), accounts[1]);
    });
  });
});
