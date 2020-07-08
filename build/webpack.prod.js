/**
 * @description: 
 * @author: zs
 * @Date: 2020-06-10 18:09:18
 * @LastEditTime: 2020-07-08 12:27:16
 * @LastEditors: zs
 */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const safePostCssParser = require('postcss-safe-parser');

const shouldUseSourceMap = false;
module.exports = {
    mode: 'production',
    devtool: 'source-map',
    optimization: { // 优化项
        splitChunks: {
            chunks: 'all',
            name: false,
        },
        minimizer: [ // 可以放置压缩方案
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser, // 查找并修复 CSS 语法错误。
                    map: shouldUseSourceMap
                        ? {
                            // `inline: false` forces the sourcemap to be output into a
                            // separate file
                            inline: false,
                            // `annotation: true` appends the sourceMappingURL to the end of
                            // the css file, helping the browser find the sourcemap
                            annotation: true,
                        }
                        : false,
                },
                cssProcessorPluginOptions: {
                    preset: ['default', { minifyFontValues: { removeQuotes: false } }],
                },
            }), // 用了这个 js 也得手动压缩
            new TerserWebpackPlugin({
                // 启动source-map
                sourceMap: shouldUseSourceMap,
                terserOptions: {
                    parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    // Added for profiling in devtools
                    keep_classnames: true,
                    keep_fnames: true,
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
            })
        ],
        // 用于后端缓存
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`,
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}