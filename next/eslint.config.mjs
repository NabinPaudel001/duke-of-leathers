import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Next.js recommended + core web vitals rules
  ...nextVitals,

  // Custom rules
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },

  // Override default ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
