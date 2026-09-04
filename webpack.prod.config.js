const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // Import TerserPlugin

function generateUniqueID() {
  const currentDate = new Date();
  return currentDate.getTime();
}
const uniqueID = generateUniqueID();

function camelCaseToDashCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const mainSceneDashCase = camelCaseToDashCase(process.env.MAIN_SCENE);

// Normalized the same way other asset paths are meant to be prefixed
// (ASSET_PREFIX + "/assets/..."), so this stays "/assets/..." (same-origin)
// when unset, matching current behavior for local/default builds.
const assetPrefix = process.env.ASSET_PREFIX
  ? process.env.ASSET_PREFIX.replace(/\/$/, '')
  : '';

module.exports = {
  entry: {
    build: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist', mainSceneDashCase), // Use path.resolve for better compatibility
    filename: 'build.[contenthash].js'
  },
  mode: 'production',
  devtool: false,
  optimization: {
    // Enable minimization
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      templateContent: `
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="Cache-control" content="no-cache">
          <meta http-equiv="Pragma" content="no-cache">
          <title>Prehistoric Domain</title>
          <style type="text/css">
            @font-face {
              font-family: 'Exo';
              src: url('${assetPrefix}/assets/font/Exo-Regular.ttf') format('truetype');
            }
          </style>
        </head>
        <body>
          <div id="app"></div>
        </body>
      </html>
    `,
      inject: true
    }),
    new webpack.DefinePlugin({
      'process.env.MAIN_SCENE': JSON.stringify(process.env.MAIN_SCENE),
      'process.env.UNIQUE_ASSETS_ID': JSON.stringify(uniqueID),
      'process.env.ASSET_PREFIX': JSON.stringify(process.env.ASSET_PREFIX)
    })
  ],
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          'aframe-super-hot-html-loader',
          {
            loader: path.resolve(__dirname, './loaders/html-require-loader.js'),
            options: {
              root: path.resolve(__dirname, 'src')
            }
          }
        ]
      },
      {
        test: /\.glsl/,
        exclude: /node_modules/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  }
};
