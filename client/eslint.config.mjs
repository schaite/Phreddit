import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest"; // Import Jest plugin

export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.test.js"], // Apply Jest config to test files
    plugins: { jest: pluginJest }, // Use Jest plugin
    rules: pluginJest.configs.recommended.rules, // Apply recommended Jest rules
    languageOptions: {
      globals: {
        ...globals.node, // Add Node.js globals
        ...globals.jest, // Add Jest globals
      },
    },
  },
];
