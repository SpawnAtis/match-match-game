const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './app/js/main.js',

  mode: 'production',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },

  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['env'] },
          },
        ],
      },
    ],
  },
};
