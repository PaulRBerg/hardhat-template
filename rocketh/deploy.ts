import { setupDeployScripts } from "rocketh";

import * as artifacts from "../generated/artifacts/index.js";
import { type Accounts, type Data, type Extensions, extensions } from "./config.js";

export { artifacts };
export const { deployScript } = setupDeployScripts<Extensions, Accounts, Data>(extensions);
