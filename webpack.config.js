const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = require('config');

/*-------------------------------------------------*/

let plugins = [
    new HTMLWebpackPlugin({
        template: path.resolve(__dirname, 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
];

if( config.get('uglify') ) {
    plugins.push( new uglifyJsPlugin( {
        sourceMap: config.get('sourcemap')
    } ) );
}

/*-------------------------------------------------*/

module.exports = {
    mode: "development",
    entry: [
        'webpack-hot-middleware/client',
        './src/index.js'
    ],
    output: {
        library: 'App',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        publicPath: config.get('publicPath')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    plugins: plugins
};
