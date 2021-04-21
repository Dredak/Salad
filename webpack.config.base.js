const path = require('path')
const HtmlWepbackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'app.bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.resolve(__dirname, './src/app/components/'),
    },
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })],
    // emitOnErrors: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65536,
              fallback: 'file-loader',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWepbackPlugin({
      template: './src/index.html',
    }),
  ],
}
