/**
 * @description: 
 * @author: zs
 * @Date: 2020-06-10 18:09:18
 * @LastEditTime 2020-07-22 17:01:00
 * @LastEditors ronffy
 */
// const DllReferencePlugin = require('webpack').DllReferencePlugin;
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const path = require('path');
const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const openBrowser = require('react-dev-utils/openBrowser');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const notifier = require('node-notifier');
const chalk = require('chalk')
const { createNotifierCallback, getNetworkIp, newWorkUrl } = require('./utils')
const { applyMock } = require('./utils/mock');
const createDevServerConfig = require('./webpackDevServer.config');
const configFactory = require('./webpack.base');

const config = configFactory('development');

const isHttps = false
const notifyOnErrors = true
const host = 'localhost';
let port = '4009';

const PORT = process.env.PORT;
if (PORT) {
	port = PORT
}

const protocol = isHttps === 'true' ? 'https' : 'http';

const urls = prepareUrls(
	protocol,
	host,
	port,
);

const compiler = webpack(merge(config, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
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

		// 设置热更新
		new webpack.HotModuleReplacementPlugin(),
		new FriendlyErrorsWebpackPlugin({
			compilationSuccessInfo: {
				messages: [
					'App running at:',
					`- Local:   ${chalk.cyan(newWorkUrl(isHttps, host, port))}`,
					`- Network: ${chalk.cyan(newWorkUrl(isHttps, getNetworkIp(), port))}`,
				],
				notes: [
					'Note that the development build is not optimized.',
					`To create a production build, run ${chalk.cyan('npm run build')}`,
				]
			},
			//  运行错误 
			// onErrors: notifyOnErrors ? createNotifierCallback : undefined,
			// 是否每次编译之间清除控制台
			// 默认为true
			// clearConsole: true,
		}),

	],
}));

const serverConfig = createDevServerConfig(
	host,
	port,
	isHttps,
);

const devServer = new WebpackDevServer(compiler, serverConfig);

devServer.listen(port, host, err => {
	if (err) {
		return console.log(err);
	}

	// We used to support resolving modules according to `NODE_PATH`.
	// This now has been deprecated in favor of jsconfig/tsconfig.json
	// This lets you use absolute paths in imports inside large monorepos:
	if (process.env.NODE_PATH) {
		console.log(
			chalk.yellow(
				'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
			)
		);
		console.log();
	}

	console.log(chalk.cyan('Starting the development server...\n'));
	openBrowser(urls.localUrlForBrowser);
});
