const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

function generateUniqueID() {
  const currentDate = new Date();
  return currentDate.getTime();
}
const uniqueID = generateUniqueID();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    port: process.env.PORT || 8080,
    hot: true,
    liveReload: true,
    server: 'https',
    client: {
      overlay: false
    },
    static: {
      directory: path.join(__dirname, '/')
    }
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.crt'))
    // }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.MAIN_SCENE': JSON.stringify(process.env.MAIN_SCENE),
      'process.env.UNIQUE_ASSETS_ID': JSON.stringify(uniqueID)
    })
  ],
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: [/(node_modules)/],
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        exclude: /(node_modules)/,
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
        exclude: /(node_modules)/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
