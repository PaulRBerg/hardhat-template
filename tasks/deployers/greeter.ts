import { task } from "hardhat/config";
import { Greeter, Greeter__factory } from "../../typechain";

task("deploy:Greeter")
  .addFlag("verify", "Verify contracts at Etherscan")
  .addParam("greeting", "Say hello, be nice")
  .setAction(async ({ verify, greeting }, hre) => {
    const greeterFactory: Greeter__factory = await hre.ethers.getContractFactory("Greeter");
    const greeter: Greeter = <Greeter>await greeterFactory.deploy(greeting);
    await greeter.deployed();
    console.log("Greeter deployed to: ", greeter.address);

    if (verify) {
      // We need to wait a little bit to verify the contract after deployment
      void delay(30000);
      await hre.run("verify:verify", {
        address: greeter.address,
        constructorArguments: [greeting],
      });
    }
  });

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
