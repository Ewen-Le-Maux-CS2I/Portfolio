/** @type {import('eslint').Linter.FlatConfig[]} */
import js from "@eslint/js";
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

  // Node scripts (SSG) should be linted with Node env
  {
    files: ["scripts/**", "scripts/**/*.js", "script/**", "script/**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },

  // Autoriser les helpers Node dans le loader côté serveur
  {
    files: ["src/lib/content.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
  },

  // Base JS rules
  js.configs.recommended,

  // JS / JSX files: enable JSX parsing for plain JS files
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
      },
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
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Project-friendly tweaks
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
