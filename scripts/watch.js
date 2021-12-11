process.env.NODE_ENV = "development";

const fs = require("fs-extra");
const paths = require("react-scripts/config/paths");
const webpack = require("webpack");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const config = require("react-scripts/config/webpack.config.js");
const path = require("path");

const conf = config("development");

let copyDestination = "./dev";
conf.output.path = path.join(process.cwd(), "./dev");
fs.removeSync("./build");
fs.removeSync("./dev");

if (!process.env.GENERATE_SOURCEMAP) {
  conf.devtool = "";
  fs.removeSync("./extension/c2d-tab");
  conf.output.path = path.join(process.cwd(), "./extension/c2d-tab");
  copyDestination = "./extension/c2d-tab";
}

for (const rule of conf.module.rules) {
  if (!rule.oneOf) continue;

  for (const one of rule.oneOf) {
    if (
      one.loader &&
      one.loader.includes("babel-loader") &&
      one.options &&
      one.options.plugins
    ) {
      one.options.plugins = one.options.plugins.filter(
        (plugin) =>
          typeof plugin !== "string" || !plugin.includes("react-refresh")
      );
    }
  }
}

conf.plugins = conf.plugins.filter(
  (plugin) =>
    !(plugin instanceof webpack.HotModuleReplacementPlugin) &&
    !(plugin instanceof ReactRefreshPlugin)
);

// We needed to output to a specific folder for cross-framework interop.
// Make sure to change the output path or to remove this line if the behavior
// of the original gist is sufficient for your needs!

webpack(conf).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    copyPublicFolder(copyDestination);
  }
  console.error(
    stats.toString({
      chunks: false,
      colors: true,
    })
  );

  if (!process.env.GENERATE_SOURCEMAP) {
    process.exit();
  }
});

function copyPublicFolder(copyDestination) {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => {
      return file !== paths.appHtml;
    },
  });

  fs.copySync(paths.appBuild, path.join(process.cwd(), copyDestination), {
    dereference: true,
    filter: (file) => {
      console.log(paths.appHtml);
      return file !== paths.appHtml;
    },
  });
}
