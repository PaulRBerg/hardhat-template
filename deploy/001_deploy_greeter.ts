import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;

  const { admin } = await getNamedAccounts();
  const greeting = "Hello, world!";

  await deployments.deploy("Greeter", {
    from: admin,
    args: [greeting],
    log: true,
  });
};

export default func;
