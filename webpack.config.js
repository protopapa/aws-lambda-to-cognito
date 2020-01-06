const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: path.resolve(__dirname, 'src'),
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, './node_modules')],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
};