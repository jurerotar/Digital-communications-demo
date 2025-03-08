import { type Config } from 'prettier';

export default {
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  trailingComma: 'es5',
  singleQuote: true,
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'ignore',
  proseWrap: 'preserve',
  arrowParens: 'always',
  singleAttributePerLine: true,
  semi: true,
  overrides: [
    {
      files: '*.ts',
      options: {
        singleQuote: true,
      },
    },
  ],
} satisfies Config;
