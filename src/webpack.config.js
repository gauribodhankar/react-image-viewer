const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  entry: path.resolve(__dirname, 'app'),
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './'),
    open: true
  },
  module: {
    loaders: [
      { test: /\.js$|.jsx$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.scss$/, exclude: /node_modules/, loaders: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      exclude: /\/node_modules/,
      parallel: true
    })
  ],
}