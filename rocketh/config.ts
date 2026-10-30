import * as deployExtension from "@rocketh/deploy";
import type { UserConfig } from "rocketh/types";

export const config = {
  accounts: { deployer: { default: 0 } },
  data: {},
} as const satisfies UserConfig;

export const extensions = { ...deployExtension };
export type Extensions = typeof extensions;
export type Accounts = typeof config.accounts;
export type Data = typeof config.data;
