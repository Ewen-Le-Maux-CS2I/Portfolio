/** @type {import('eslint').Linter.FlatConfig[]} */
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // Ignore build artifacts
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.cjs",
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // JS / JSX files: enable JSX parsing for plain JS files
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    rules: {
      // allow unused vars pattern for JS as well
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // JSX rules for .jsx files (generic + hooks)
  {
    files: ["**/*.jsx"],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Project-friendly tweaks
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
