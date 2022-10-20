import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";

import { TokenX, VaultV2 } from "../types";

describe("Deploy proxy tests", function () {
  it("Able to withdraw after upgrade", async function () {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const [admin, depositor] = signers;
    const tokenX: TokenX = await ethers.getContract("TokenX", admin);
    const vault: VaultV2 = await ethers.getContract("Vault");

    await tokenX.mint(depositor.address, ethers.utils.parseEther("1000"));
    await tokenX.connect(depositor).approve(vault.address, ethers.utils.parseEther("100000"));

    await vault.connect(depositor).deposit(ethers.utils.parseEther("10"));
    const balanceBefore = await tokenX.balanceOf(depositor.address);
    await vault.connect(depositor).withdraw(ethers.utils.parseEther("1"));
    const balanceAfter = await tokenX.balanceOf(depositor.address);

    expect(balanceAfter).to.greaterThan(balanceBefore);
  });
});
