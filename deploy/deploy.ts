import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const DAY_IN_SECONDS = 60 * 60 * 24;
const NOW_IN_SECONDS = Math.round(Date.now() / 1000);
const UNLOCK_IN_X_DAYS = NOW_IN_SECONDS + DAY_IN_SECONDS * 1; // 1 DAY

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const lockedAmount = hre.ethers.parseEther("0.01").toString();

  const lock = await deploy("Lock", {
    from: deployer,
    args: [UNLOCK_IN_X_DAYS],
    log: true,
    value: lockedAmount,
  });

  console.log(`Lock contract: `, lock.address);
};
export default func;
func.id = "deploy_lock"; // id required to prevent reexecution
func.tags = ["Lock"];
