import { task } from "hardhat/config";

import { VaultProxy, VaultV2, VaultV2__factory } from "../types";

task("deploy:v2", "Upgrade to v2 contract", async (_, { getNamedAccounts, deployments, ethers }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const vaultRes = await deploy("VaultV2", {
    from: deployer,
    contract: VaultV2__factory,
    gasLimit: 4000000,
    args: [],
    log: true,
  });

  const tokenX = await ethers.getContract("tokenX");
  const vaultProxy: VaultProxy = await ethers.getContract("VaultProxy");
  const vaultV2: VaultV2 = await ethers.getContract("VaultV2");

  vaultV2.initialize("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", {
    vaultType: 0,
    decimals: 18,
    asset: tokenX.address,
    cap: ethers.utils.parseEther("" + 1000),
  });

  vaultProxy.upgradeTo(vaultV2.address);
});
