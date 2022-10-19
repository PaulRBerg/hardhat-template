import { task } from "hardhat/config";

task("export", "Export all to deployments", async (_, { deployments }) => {
  const { run } = deployments;

  await run([], {
    writeDeploymentsToFiles: true,
  });
});

task("exportV2", "Export all to deployments", async (_, { deployments }) => {
  const { run } = deployments;

  await run([], {
    writeDeploymentsToFiles: true,
  });
});
