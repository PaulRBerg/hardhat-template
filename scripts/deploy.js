const {
  etherBalanceString: etherBalanceStr,
  deployContract,
  toWei,
  toWeiString: toWeiStr,
  log,
  logString,
  logGas,
  verifyContract,
} = require("../utils/utils.js");

async function main() {
  const { chainId, name } = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();

  console.log(`Connected to name: ${name} & chainId: ${chainId}`);
  console.log(`Deploying contracts with the account: ${owner.address}`);
  console.log(`Owner balance: ${await etherBalanceStr(owner.address)}`);

  const NETWORK = "rinkeby";

  const args = [
    "testing new created token",
    "TCT",
    toWeiStr("6000000"),
    owner.address,
  ];
  const testingContract = await deployContract(owner, "TestingContract", args);
  await logGas(testingContract.deployTransaction);
  if (chainId != 31337) {
    await verifyContract(
      NETWORK,
      "TestingContract",
      testingContract.address,
      args
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
