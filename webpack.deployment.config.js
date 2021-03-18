const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve } = require('path');

module.exports = {

  // devtool: 'source-map',
  entry: {
    "index.js": "./src/index.jsx",
    "accountsettings/index.js": "./src/accountsettings/index.jsx",
    // "admin/index.js": "./src/admin/index.jsx", 
    // "chooser/index.js":"./src/chooser/index.jsx", 
    // "course/index.js": "./src/course/index.jsx",
    "dashboard/index.js": "./src/dashboard/index.jsx",
    "docs/index.js": "./src/docs/index.jsx",
    "editor/index.js": "./src/editor/index.jsx",
    // "exam/index.js": "./src/exam/index.jsx",
    // "gradebook/index.js": "./src/gradebook/index.jsx",
    // "guesteditor/index.js": "./src/guesteditor/index.jsx",
    // "page/index.js": "./src/page/index.jsx",
    "library/index.js": "./src/library/index.jsx",
    "signin/index.js": "./src/signin/index.jsx",
    "signout/index.js": "./src/signout/index.jsx",
    // "viewer/index.js": "./src/viewer/index.jsx",
    // "exampletool/index.js": "./src/exampletool/index.jsx",

  },

  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name]',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".js", ".jsx"]
        },
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: { minimize: true }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.doenet$/,
        use: { loader: "raw-loader" }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: { 
              limit: 10000, // Convert images < 10kb to base64 strings
              name: 'media/[hash]-[name].[ext]'
            } 
          },
        ],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: "url-loader"
        }
      }
    ]
  },
  plugins: [
    // new HtmlWebPackPlugin({
    //   chunks: ['admin/index.js'],
    //   template: "./src/admin/index.html",
    //   filename: "./admin/index.html",
    //   favicon: "./src/Tools/favicon.ico",

    // }),
    new HtmlWebPackPlugin({
      chunks: ["chooser/index.js"],
      template: "./src/chooser/index.html",
      filename: "./chooser/index.html",
      favicon: "./src/Tools/favicon.ico",

    }),
    // new HtmlWebPackPlugin({
    //   chunks: ["course/index.js"],
    //   template: "./src/course/index.html",
    //   filename: "./course/index.html",
    //   favicon: "./src/Tools/favicon.ico",

    // }),
    new HtmlWebPackPlugin({
      chunks: ['dashboard/index.js'],
      template: "./src/dashboard/index.html",
      filename: "./dashboard/index.html",
      favicon: "./src/Tools/favicon.ico",
    }),
    
    new HtmlWebPackPlugin({
      chunks: ['docs/index.js'],
      template: "./src/docs/index.html",
      filename: "./docs/index.html",
      favicon: "./src/Tools/favicon.ico",

    }),
    new HtmlWebPackPlugin({
      chunks: ['library/index.js'],
      template: "./src/library/index.html",
      filename: "./library/index.html",
      favicon: "./src/Tools/favicon.ico",
    }),
    // new HtmlWebPackPlugin({
    //   chunks: ['editor/index.js'],
    //   template: "./src/editor/index.html",
    //   filename: "./editor/index.html",
    //   favicon: "./src/Tools/favicon.ico",
    // }),

    // new HtmlWebPackPlugin({
    //   chunks: ["exam/index.js"],
    //   template: "./src/exam/index.html",
    //   filename: "./exam/index.html",
    //   favicon: "./src/Tools/favicon.ico",

    // }),
    // Gradebook
    // new HtmlWebPackPlugin({
    //   chunks: ['gradebook/index.js'],
    //   template: "./src/gradebook/index.html",
    //   filename: "./gradebook/index.html",
    //   favicon: "./src/Tools/favicon.ico",

    // }),
       // Guest Editor
      //  new HtmlWebPackPlugin({
      //   chunks: ['guesteditor/index.js'],
      //   template: "./src/guesteditor/index.html",
      //   filename: "./guesteditor/index.html",
      //   favicon: "./src/Tools/favicon.ico",

      // }),
    // new HtmlWebPackPlugin({
    //   chunks: ['gradebook/index.js'],
    //   template: "./src/gradebook/assignment/index.html",
    //   filename: "./gradebook/assignment/index.html",
    //   favicon: "./src/Tools/favicon.ico",
    // }),
    // new HtmlWebPackPlugin({
    //   chunks: ['gradebook/index.js'],
    //   template: "./src/gradebook/attempt/index.html",
    //   filename: "./gradebook/attempt/index.html",
    //   favicon: "./src/Tools/favicon.ico",
    // }),
    // /Gradebook
    // new HtmlWebPackPlugin({
    //   chunks: ["page/index.js"],
    //   template: "./src/page/index.html",
    //   filename: "./page/index.html"
    //   // favicon: "",
    // }),
    new HtmlWebPackPlugin({
      chunks: ["accountsettings/index.js"],
      template: "./src/accountsettings/index.html",
      filename: "./accountsettings/index.html",
      favicon: "./src/Tools/favicon.ico",

    }),
    // new HtmlWebPackPlugin({
    //   chunks: ["test/index.js"],
    //   template: "./src/test/index.html",
    //   filename: "./test/index.html",
    //   favicon: "./src/Tools/favicon.ico",

    // }),
    new HtmlWebPackPlugin({
      chunks: ["signin/index.js"],
      template: "./src/signin/index.html",
      filename: "./signin/index.html",
      favicon: "./src/Tools/favicon.ico",
    }),
    new HtmlWebPackPlugin({
      chunks: ["signout/index.js"],
      template: "./src/signout/index.html",
      filename: "./signout/index.html",
      favicon: "./src/Tools/favicon.ico",
    }),
    // new HtmlWebPackPlugin({
    //   chunks: ["viewer/index.js"],
    //   template: "./src/viewer/index.html",
    //   filename: "./viewer/index.html"
    //   // favicon: "",
    // }),
    //exampletool
    new HtmlWebPackPlugin({
      chunks: ["exampletool/index.js"],
      template: "./src/exampletool/index.html",
      filename: "./exampletool/index.html"
      // favicon: "",
    }),
    
    new MiniCssExtractPlugin({
      filename: "[name].css",
      // filename: "main.css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      { from: 'cypress_php' }
    ]),
    new CopyWebpackPlugin([
      { from: 'static' }
    ])
  ],
  devServer: {
    port: 3000,
    // openPage: "protected",
  },
  // devtool: 'source-map'
};