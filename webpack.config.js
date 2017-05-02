module.exports = {
  entry: './webapp/src/app.js',
  output: {
    filename: './webapp/dist/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      }
    ]
  }
}