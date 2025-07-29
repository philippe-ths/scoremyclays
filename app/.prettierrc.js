/** @type {import("prettier").Config} */
module.exports = {
  // Core formatting options
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  // JSX and React
  jsxSingleQuote: true,

  // Trailing commas
  trailingComma: 'es5',

  // Spacing
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'avoid',

  // Line endings (auto for cross-platform compatibility)
  endOfLine: 'auto',

  // File inclusion
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        printWidth: 100,
        proseWrap: 'always',
      },
    },
  ],
};
