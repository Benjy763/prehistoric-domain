const MinifyPlugin = require('babel-minify-webpack-plugin');
const fs = require('fs');
const ip = require('ip');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const hash = Math.random() * 100000 + 1000;

PLUGINS = [
  new HtmlWebpackPlugin({
    filename: './index.html',
    templateContent: `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Prehistoric Domain</title>
        <script src="/vendors/aframe/aframe-v1.3.0.min.js"></script>
        <script src="/vendors/water/refractor.js"></script>
        <script src="/vendors/water/reflector.js"></script>
        <script src="/vendors/water/water2.js"></script>
        <style type="text/css">
          @font-face {
            font-family: 'Exo';
            src: url('/assets/font/Exo-Regular.ttf') format('truetype');
          }
        </style>
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>
  `,
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new webpack.HotModuleReplacementPlugin(),
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
    path: __dirname + '/dist',
    filename: 'build.[hash].js',
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: [/(node_modules)/, /vendors/],
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
        test: /\.png|\.jpg|\.gif|\.mp4/,
        exclude: /(node_modules)/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')],
  },
};
