import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Target JavaScript, ES modules, and JSX files
    languageOptions: {
      ecmaVersion: "latest", // Use the latest ECMAScript version
      sourceType: "module", // Set to 'module' for ES module support
      globals: {
        ...globals.browser, // Include browser globals
        ...globals.node, // Include Node.js globals (e.g., require, module)
      },
    },
    rules: {
      // Add any custom rules here if necessary
    },
  },
  pluginJs.configs.recommended, // Use recommended JavaScript rules
  pluginReact.configs.flat.recommended, // Use recommended React rules
];

