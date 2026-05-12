//  @ts-check

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 95,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles.css",
  tailwindFunctions: ["cn"],
};

export default config;
