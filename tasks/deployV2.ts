import { task } from "hardhat/config";

import { VaultV2__factory } from "../types";

task("deploy:v2", "Upgrade to v2 contract", async (_, { getNamedAccounts, deployments, ethers }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const tokenX = await ethers.getContract("TokenX");
  const vaultV1 = await ethers.getContract("Vault");

  const vaultRes = await deploy("Vault", {
    from: deployer,
    contract: VaultV2__factory,
    gasLimit: 4000000,
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: "ProxyAdmin",
    },
  });
});

export {};
