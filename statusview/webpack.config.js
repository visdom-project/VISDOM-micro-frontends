const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "visdom",
    projectName: "statusview",
    webpackConfigEnv,
  });

  return webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
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
