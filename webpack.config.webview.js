const path = require('path');

module.exports = {
  mode: 'production',
  entry: './webview/src/index.tsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'webview/build'),
    filename: 'bundle.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
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
  },
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
};