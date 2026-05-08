import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      jsdoc: (await import("eslint-plugin-jsdoc")).default,
    },
    rules: {
      "complexity": ["error", 25],
      "max-lines-per-function": ["error", { "max": 200, "skipBlankLines": true, "skipComments": true }],
      "jsdoc/require-jsdoc": [
        "error",
        {
          "publicOnly": true,
          "require": {
            "FunctionDeclaration": true,
            "MethodDefinition": true,
            "ClassDeclaration": true,
            "ArrowFunctionExpression": true,
            "FunctionExpression": true
          }
        }
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-returns": "error",
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
