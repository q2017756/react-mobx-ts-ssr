import fs from 'fs-extra'
import path from 'path'
import webpack from 'webpack'
import serverConfig from './webpack.server'
import clientConfig from '../client/webpack.client'
import configs from '../../configs'

import _debug from 'debug'
const debug = _debug('app:server:compile');

const inRoot = path.resolve.bind(path, configs.pathBase)
const inRootSrc = (file) => inRoot(configs.pathBase, file)

const webpackCompiler = (config, statsFormat = { chunks : false, chunkModules : false, colors : true}) => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      const jsonStats = stats.toJson();
      debug('Webpack compile completed.');
      debug(stats.toString(statsFormat));

      if (err) {
        debug('Webpack compiler encountered a fatal error.', err);
        return reject(err)
      } else if (jsonStats.errors.length > 0) {
        debug('Webpack compiler encountered errors.');
        debug(jsonStats.errors.join('\n'));
        return reject(new Error('Webpack compiler encountered errors'))
      } else if (jsonStats.warnings.length > 0) {
        debug('Webpack compiler encountered warnings.');
        debug(jsonStats.warnings.join('\n'))
      } else {
        debug('No errors or warnings encountered.')
      }
      resolve(jsonStats)
    })
  })
}

(async function () {
  try {
    debug('Run compiler');
    const clientStats = await webpackCompiler(clientConfig)
    if (clientStats.warnings.length && config.compiler_fail_on_warning) {
      debug('Client Config set to fail on warning, exiting with status code "1".');
      process.exit(1)
    }
    debug('Copy client static assets to dist folder.');
    fs.copySync(
      // path.resolve(configs.pathBase, 'src/public'),
      // path.resolve(configs.pathBase, configs.outDir),
      configs.publicDir, configs.outDir
    )


    const serverStats = await webpackCompiler(serverConfig);
    if (serverStats.warnings.length && config.compiler_fail_on_warning) {
      debug('Server Config set to fail on warning, exiting with status code "1".');
      process.exit(1)
    }
    debug('Server Copy static assets to dist folder.');
    fs.copySync(
      // path.resolve(configs.pathBase, 'src/public'),
      // path.resolve(configs.pathBase, configs.outDir),
      configs.publicDir, configs.outDir
    )
  } catch (e) {
    debug('Compiler encountered an error.', e);
    process.exit(1)
  }
})();
