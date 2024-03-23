const ip = require('ip');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

function generateUniqueID() {
  const currentDate = new Date();
  return currentDate.getTime();
}
const uniqueID = generateUniqueID();
PLUGINS = [
  new webpack.DefinePlugin({
    'process.env.UNIQUE_ASSETS_ID': JSON.stringify(uniqueID),
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV', 'MAIN_SCENE']),
  new webpack.HotModuleReplacementPlugin(),
  new CopyPlugin([
    { from: './src/assets/models', to: 'assets/models' },
    { from: './src/assets/images', to: 'assets/images' },
    { from: './src/assets/sounds', to: 'assets/sounds' },
    { from: './src/assets/font', to: 'assets/font' },
    { from: './src/vendors', to: 'vendors' },
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
