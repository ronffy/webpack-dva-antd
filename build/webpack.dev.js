/**
 * @description: 
 * @author: zs
 * @Date: 2020-06-10 18:09:18
 * @LastEditTime: 2020-06-25 18:04:26
 * @LastEditors: zs
 */
// const DllReferencePlugin = require('webpack').DllReferencePlugin;
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const path = require('path');
const apiMocker = require('mocker-api')
const fs = require('fs')
const { mockApiToApp } = require('mockjs-server-cli');
const mockData = require('../mock.config.js');

const host = '127.0.0.1';
const port = '4000';

module.exports = {
	mode: 'development',
	devtool: 'eval-cheap-module-souce-map',
	watchOptions: {
		ignored: /node_modules/
	},
	plugins: [
		// // 先到这里面进行查找
		// new DllReferencePlugin({
		// 	// 注意: DllReferencePlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
		// 	context: path.resolve(__dirname, '../'),
		// 	manifest: path.resolve(__dirname, '../dll/manifest.json')
		// }),
		// // 引入库里面打包好的内容，就是react和react-dom
		// new AddAssetHtmlPlugin({
		// 	filepath: path.resolve(__dirname, '../dll/react.dll.js')
		// }),
	],
	devServer: { // 开发服务的配置 
		host,
		port,
		open: true,
		compress: true,// gzip 可以提升返回页面的速度
		watchContentBase: true, // 监视 contentBase 目录下的所有文件，一旦文件变化就会 reload
		contentBase: path.resolve(__dirname, '../dist'), // webpack启动服务会在dist目录下
		// overlay: false,
		overlay: {
			warnings: true,
			errors: true
		},
		hot: true,
		historyApiFallback: true, // 在devServer里面有个historyApiFallback的属性，是用于如果找不到界面就返回默认首页，上线时需要使用nginx

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
			mockApiToApp(app, mockData)
		}

	}
}