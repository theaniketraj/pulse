const path = require('path');

module.exports = {
  entry: './webview/src/index.tsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'webview/build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'webview/public'),
    port: 3000,
    hot: true
  }
};