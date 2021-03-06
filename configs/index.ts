/* tslint:disable */
import * as path from 'path'

export default {
  // base configuration
  env: process.env.NODE_ENV || 'development',
  render: process.env.RENDER_TYPE || 'client',
  pathBase: path.join(__dirname, '..'),
  pathSrc: path.join(__dirname, '../src'),
  outDir: path.join(__dirname, '../dist'),
  publicDir: path.join(__dirname, '../src/public'),
  port: process.env.PORT || 4000,
  compilerVendor: [
    'react',
    'react-dom',
    'react-router-dom',
  ],
  sourcemaps: false,
  globals: {},
  compilerPublicPath: '/',
}
