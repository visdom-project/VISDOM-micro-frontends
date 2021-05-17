const { merge } = require("webpack-merge");
const webpack = require("webpack");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "visdom",
    projectName: "studentview",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new webpack.DefinePlugin({
        __ELASTICSEARCH_HOST__: JSON.stringify(process.env.ELASTICSEARCH_HOST),
      }),
    ],
    module: {
      rules: [
        { test: /\\.css$/, use: ["style-loader", "css-loader"] },

        {
          test: /\.(gif|ttf|eot|svg|woff2?)$/,
          use: "url-loader?name=[name].[ext]",
        },
      ],
    },
    devServer: {
      https: true,
    },
  });
};
