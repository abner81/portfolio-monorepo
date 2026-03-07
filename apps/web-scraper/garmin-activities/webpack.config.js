const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = (_config, ctx) => {
  const watch = Boolean(ctx?.options?.watch);

  return {
    output: {
      path: join(__dirname, '../../../dist/apps/web-scraper/garmin-activities'),
      ...(process.env.NODE_ENV !== 'production' && {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      }),
    },
    watch,
    plugins: [
      new NxAppWebpackPlugin({
        target: 'node',
        compiler: 'tsc',
        main: './src/main.ts',
        tsConfig: './tsconfig.app.json',
        assets: ['./src/assets'],
        optimization: false,
        outputHashing: 'none',
        generatePackageJson: true,
        sourceMaps: true,
        watch,
      }),
    ],
  };
};
