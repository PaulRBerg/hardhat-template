import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["artifacts/", "build/", "cache/", "coverage/", "dist/", "generated/", "node_modules/", "types/"]),
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    extends: [tsPlugin.configs["flat/recommended"], prettier],
    languageOptions: { parser: tsParser, parserOptions: { project: "./tsconfig.json" } },
    rules: {
      "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true, ignoreVoid: true }],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "_", varsIgnorePattern: "_" }],
    },
  },
]);
