import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: [
      '.next/**',
      '.next-check/**',
      'node_modules/**',
      'e2e/**',
      'public/**',
      'src/fonts/**',
    ],
  },
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
];

export default config;
