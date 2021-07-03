/** @type {import('@jest/types').Config.InitialOptions} */
require('./.pnp.js').setup();
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const requireJSON = require('require-strip-json-comments');
const { compilerOptions } = requireJSON('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true,
    },
  },
  verbose: true,
  setupFilesAfterEnv: ['jest-expect-message'],
  collectCoverage: true,
  coverageDirectory: './reports/coverage',
  reporters: [
    'default',
    [
      require.resolve('jest-html-reporter'),
      {
        pageTitle: 'Test Report',
        outputPath: './reports/test/index.html',
      },
    ],
    [
      require.resolve('jest-junit'),
      { outputDirectory: './reports/junit', outputName: 'results.xml' },
    ],
  ],
};
