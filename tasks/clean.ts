import fsExtra from "fs-extra";
import { TASK_CLEAN } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";

task(TASK_CLEAN, "Overrides the standard clean task", async function (_taskArgs, _hre, runSuper) {
  await fsExtra.remove("./coverage");
  await fsExtra.remove("./coverage.json");
  await runSuper();
});
