const MinifyPlugin = require('babel-minify-webpack-plugin');
const fs = require('fs');
const ip = require('ip');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

PLUGINS = [
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.HotModuleReplacementPlugin(),
  new CopyPlugin([
    { from: './src/models', to: 'build/models' },
    { from: './src/images', to: 'build/images' },
    { from: './src/sounds', to: 'build/sounds' },
    { from: './src/font', to: 'build/font' },
  ]),
];

module.exports = {
  devServer: {
    disableHostCheck: true,
    hotOnly: true,
  },
  entry: {
    build: './src/index.js',
  },
  output: {
    path: __dirname,
    filename: 'build/[name].js',
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: ['babel-loader', 'aframe-super-hot-loader'],
      },
      {
        test: /\.html/,
        exclude: /(node_modules)/,
        use: [
          'aframe-super-hot-html-loader',
          {
            loader: 'super-nunjucks-loader',
            options: {
              globals: {
                HOST: ip.address(),
                IS_PRODUCTION: process.env.NODE_ENV === 'production',
              },
              path: process.env.NUNJUCKS_PATH || path.join(__dirname, 'src'),
            },
          },
          {
            loader: 'html-require-loader',
            options: {
              root: path.resolve(__dirname, 'src'),
            },
          },
        ],
      },
      {
        test: /\.glsl/,
        exclude: /(node_modules)/,
        loader: 'webpack-glsl-loader',
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.png|\.jpg|\.gif/,
        exclude: /(node_modules)/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')],
  },
};
