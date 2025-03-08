/** @type {import("prettier").Config} */
module.exports = {
  // Formatting basics
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  trailingComma: "es5",
  insertPragma: false,
  requirePragma: false,

  // Quote style
  singleQuote: true,
  jsxSingleQuote: true,
  quoteProps: "as-needed",

  // Bracket & Object Spacing
  bracketSpacing: true,
  jsxBracketSameLine: false,
  bracketSameLine: false,

  // HTML & JSX Formatting
  htmlWhitespaceSensitivity: "ignore",
  proseWrap: "preserve",

  // Imports & Sorting
  importOrder: ["^@?\\w", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  // Trailing spaces and newlines
  trimTrailingWhitespace: true,
  insertFinalNewline: true,

  // Special cases
  arrowParens: "always",
  semi: true,
  overrides: [
    {
      files: "*.ts",
      options: {
        singleQuote: true,
        bracketSpacing: true,
      },
    },
  ],
};
