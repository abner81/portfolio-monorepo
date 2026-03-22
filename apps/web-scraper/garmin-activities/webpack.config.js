const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = (_config, ctx) => {
  const watch = Boolean(ctx?.options?.watch);
  const workspaceRoot = ctx?.workspaceRoot || __dirname + '/../../..';

  return {
    output: {
      path: join(__dirname, '../../../dist/apps/web-scraper/garmin-activities'),
      ...(process.env.NODE_ENV !== 'production' && {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      }),
    },
    watch,
    stats: {
      warnings: true,
      preset: 'errors-only',
    },
    infrastructureLogging: {
      level: 'log', // 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose'
    },
    resolve: {
      alias: {
        'garmin-activities/domain': join(workspaceRoot, 'apps/web-scraper/garmin-activities/src/domain'),
        'garmin-activities/application': join(workspaceRoot, 'apps/web-scraper/garmin-activities/src/application'),
        'garmin-activities/shared': join(workspaceRoot, 'apps/web-scraper/garmin-activities/src/shared'),
        'garmin-activities/infra': join(workspaceRoot, 'apps/web-scraper/garmin-activities/src/infrastructure'),
      },
      extensions: ['.ts', '.js', '.json'],
    },
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
