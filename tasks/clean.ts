import fsExtra from "fs-extra";
import { TASK_CLEAN } from "@nomiclabs/buidler/builtin-tasks/task-names";
import { task } from "@nomiclabs/buidler/config";

task(TASK_CLEAN, "Overrides the standard clean task", async function (_taskArgs, { config }, runSuper) {
  await fsExtra.remove(config.paths.coverage);
  await fsExtra.remove(config.paths.coverageJson);
  if (config.typechain?.outDir) {
    await fsExtra.remove(config.typechain.outDir);
  }
  await runSuper();
});
