import eslint from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-config-prettier/flat";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  prettierPlugin,
  sveltePlugin.configs["flat/recommended"],
  sveltePlugin.configs["flat/prettier"],
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".svelte"],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      importPlugin: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
    },
  },
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

          // Multiple tsconfigs/jsconfigs (Useful for monorepos, but discouraged in favor of `references` supported)
          project: "packages/*/{ts,js}config.json",
        },
      },
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.js"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    ignores: [
      "**/*.js",
      "**/*.mjs",
      "**/test",
      "**/coverage",
      "**/dist",
      "**/node_modules",
    ],
  }
);
