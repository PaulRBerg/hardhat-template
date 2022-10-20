import { task } from "hardhat/config";

import { ProxyAdmin__factory, TokenX__factory, Vault__factory } from "../types";

task("deploy:v1", "Deploy vault contracts", async (_, { getNamedAccounts, deployments, ethers }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const tokenXRes = await deploy("TokenX", {
    from: deployer,
    contract: TokenX__factory,
    gasLimit: 4000000,
    args: [],
    log: true,
  });

  const proxyAdminRes = await deploy("ProxyAdmin", {
    from: deployer,
    contract: ProxyAdmin__factory,
    gasLimit: 4000000,
    args: [],
    log: true,
  });

  const vaultRes = await deploy("Vault", {
    from: deployer,
    contract: Vault__factory,
    gasLimit: 4000000,
    args: [],
    log: true,
    proxy: {
      owner: deployer,
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: "ProxyAdmin",
      execute: {
        methodName: "initialize",
        args: [
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          {
            vaultType: 0,
            decimals: 18,
            asset: tokenXRes.address,
            cap: ethers.utils.parseEther("" + 1000),
          },
        ],
      },
    },
  });
});

export {};
