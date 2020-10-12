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
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-179628072-1"
        ></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());

          gtag('config', 'UA-179628072-1');
        </script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());

          gtag('config', 'UA-179628072-1');
        </script>
        <meta name="viewport" content="initial-scale=1">
        <meta charset="UTF-8" />
        <title>Jurassic Tour VR</title>
        <style type="text/css">
          @font-face {
            font-family: 'Tribeca';
            src: url('./font/Tribeca.ttf') format('truetype');
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
  new CopyPlugin([
    { from: './website/images', to: './images' },
    { from: './website/sounds', to: './sounds' },
    { from: './website/font', to: './font' },
  ]),
];

module.exports = {
  devServer: {
    disableHostCheck: true,
    hotOnly: true,
  },
  entry: {
    build: './website/index.js',
  },
  output: {
    path: __dirname + '/dist-ws',
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
