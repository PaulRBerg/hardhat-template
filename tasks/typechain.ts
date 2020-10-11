import { TASK_COMPILE } from "@nomiclabs/buidler/builtin-tasks/task-names";
import { TypeChain } from "typechain/dist/TypeChain";
import { task } from "@nomiclabs/buidler/config";
import { tsGenerator } from "ts-generator";

import { TASK_TYPECHAIN } from "./task-names";

task(TASK_TYPECHAIN, "Generate TypeChain typings for compiled contracts", async function (_taskArgs, { config, run }) {
  if (!config.typechain || !config.typechain?.outDir || !config.typechain?.target) {
    throw new Error("Invalid TypeChain configuration. Please provide it via buidler.config.ts");
  }

  await run(TASK_COMPILE);

  console.log(
    `Creating TypeChain artifacts in directory ${config.typechain.outDir} for target ${config.typechain.target}`,
  );

  const cwd: string = process.cwd();
  await tsGenerator(
    { cwd },
    new TypeChain({
      cwd,
      rawConfig: {
        files: config.paths.artifacts + "/*.json",
        outDir: config.typechain.outDir,
        target: config.typechain.target,
      },
    }),
  );

  console.log(`Successfully generated TypeChain artifacts!`);
});
