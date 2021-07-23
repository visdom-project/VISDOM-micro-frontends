const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const webpack = require("webpack");

require("dotenv").config();

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "visdom",
    projectName: "ekgview",
    webpackConfigEnv,
    argv,
  });

  return webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new webpack.DefinePlugin({
        __ELASTICSEARCH_HOST__: JSON.stringify(process.env.ELASTICSEARCH_HOST),
      }),
      new webpack.DefinePlugin({
        __MQTT_HOST__: JSON.stringify(process.env.MQTT_HOST),
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
  });
};
