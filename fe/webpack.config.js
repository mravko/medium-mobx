var webpack = require("webpack");
var path = require("path");

// variables
var isProduction =
  process.argv.indexOf("-p") >= 0 || process.env.NODE_ENV === "production";
var sourcePath = path.join(__dirname, "./src");
var outPath = path.join(__dirname, "./build");

// plugins
var HtmlWebpackPlugin = require("html-webpack-plugin");
var WebpackCleanupPlugin = require("webpack-cleanup-plugin");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

var plugins = [
  new webpack.EnvironmentPlugin({
    NODE_ENV: "development", // use 'development' unless process.env.NODE_ENV is defined
    DEBUG: false
  }),
  new WebpackCleanupPlugin(),
  new HtmlWebpackPlugin({
    template: "assets/index.html"
  })
];

if (isProduction) plugins.push(new BundleAnalyzerPlugin());

module.exports = {
  context: sourcePath,
  entry: {
    app: "./main.tsx"
  },
  output: {
    path: outPath,
    filename: isProduction ? "[contenthash].js" : "[hash].js",
    chunkFilename: isProduction ? "[name].[contenthash].js" : "[name].[hash].js"
  },
  target: "web",
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ["module", "browser", "main"],
    alias: {
      app: path.resolve(__dirname, "src/app/")
    }
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: "babel-loader"
          },
          "ts-loader"
        ].filter(Boolean)
      },
      // static assets
      { test: /\.html$/, use: "html-loader" },
      { test: /\.(a?png|svg)$/, use: "url-loader?limit=10000" },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: "file-loader"
      },
      {
        test: /\.css$/i,
        use: ["css-loader"]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      name: true,
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: -10,
          // minSize: 0,
          // maxSize: 243000, // in bytes
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: ".",
          automaticNameMaxLength: 30,
          filename: isProduction
            ? "vendor.[contenthash].js"
            : "vendor.[hash].js"
        }
      }
    },
    runtimeChunk: true
  },
  plugins: plugins,
  devServer: {
    contentBase: sourcePath,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: "minimal",
    clientLogLevel: "warning"
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: isProduction ? "none" : "source-map",
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: "empty",
    net: "empty"
  }
};
