/**
 * @description
 * @author ronffy
 * @Date 2020-07-22 14:49:49
 * @LastEditTime 2020-07-22 16:20:12
 * @LastEditors ronffy
 */
const path = require('path');
const { applyMock } = require('./utils/mock');

module.exports = function (host, port, isHttps) {
  // 开发服务的配置
  return {
    host,
    https: isHttps,
    compress: true, // gzip 可以提升返回页面的速度
    watchContentBase: true, // 监视 contentBase 目录下的所有文件，一旦文件变化就会 reload
    contentBase: path.resolve(__dirname, '../dist'), // webpack启动服务会在dist目录下
    overlay: false,
    // overlay: {
    // 	warnings: false,
    // 	errors: true
    // },
    // 除了一些基本启动信息以外，其他内容都不要显示
    quiet: true,
    hot: true,

    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: 'ws',
    injectClient: false,

    // progress: true, //显示打包的进度
    historyApiFallback: true, // 在devServer里面有个historyApiFallback的属性，是用于如果找不到界面就返回默认首页，上线时需要使用nginx
    disableHostCheck: true, //  新增该配置项
    proxy: {
      // 一旦devServer(5000)服务器接受到 /api/xxx 的请求，就会把请求转发到另外一个服务器(3000)
      '/api': {
        target: `http://${host}:${port}`,
        changeOrigin: true,
        // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
        pathRewrite: {
          '^/api': ''
        }
      },
      bypass(req) {
        if (req.headers.accept.indexOf('html') !== -1) {
          return '/index.html'
        }
      }
    },
    before(app, server) {
      // mockApiToApp(app, mockData)
      try {
        applyMock(server);
      } catch (e) {
        console.log(e);
      }
    }

  }
}
