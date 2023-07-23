const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const env = require("dotenv").config({
  path: path.join(__dirname, ".env"),
}).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  // entry: { main: "./src/index.js", polyfills: "./src/polyfills.js" },
  entry: "./src/index.js",
  devtool: false,
  // historyApiFallback: true,
  output: {
    path: path.join(__dirname, "./build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
      {
        test: /react-datepicker.css/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
        exclude: /src/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|gif|png)$/,
        use: {
          loader: "file-loader",
          options: { name: "static/images/[name].[ext]" },
        },
      },
      {
        test: /\.svg$/,
        use: "svg-url-loader",
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
    // stats: { errorDetails: true },
    // contentBase: path.join(__dirname, "../dist/shop"),
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // filename: "shop.html",
    }),
    new DefinePlugin(envKeys),
  ],
  resolve: {
    // extensions: ["", ".js", ".jsx", ".css"],
    fallback: {
      zlib: require.resolve("browserify-zlib"),
      querystring: require.resolve("querystring-es3"),
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      buffer: require.resolve("buffer/"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      url: require.resolve("url/"),
      fs: require.resolve("browserfs"),
      async_hooks: false,
    },
  },
};
