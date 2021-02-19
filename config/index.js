// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
module.exports = {
  build: {

    prodEnv: require('./prod.env'),
    testEnv: require('./test.env'),
    index: path.resolve(__dirname, '../NHIS/index.html'),
    assetsRoot: path.resolve(__dirname, '../NHIS'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/NHIS/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },

  dev: {
    env: require('./dev.env'),
    host: '0.0.0.0',
    port: 9520,
    autoOpenBrowser: true,
    autoOpenPage: '/login',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/NHIS/',
    proxyTable: {
      '/api': {
        target: 'http://172.16.0.114:8213', //'http://172.16.0.128:8213', 
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/sss': {
        target: 'https://www.koreandoctor.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/sss': '/'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
