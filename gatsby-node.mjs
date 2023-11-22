import { processStyleResources } from "./node/StyleFactoryNode.mjs";
import { processIIFEFunction } from "./node/IIFEFunctionNode.mjs";

//TODO work with webpack in production-app.js for hot reload, etc
//https://www.gatsbyjs.com/docs/production-app/

//if using this async()(), have to have a ; above or get a TypeError:console.log(...) is not a function
//https://stackoverflow.com/questions/31013221/typeerror-console-log-is-not-a-function

console.log("In the HSB dev repo");

// webpack export stats?

//https://webpack.js.org/api/module-methods/#magic-comments

//TODO add <style data-href> https://www.gatsbyjs.com/docs/resource-handling-and-service-workers/
// and https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/cache-dir/static-entry.js#L311
//what is import { ForceCssHMRForEdgeCases } from "./webpack/force-css-hmr-for-edge-cases"

// NOTE You can author gatsby-config and gatsby-node in ESM syntax.
// This feature was added in gatsby@5.3.0.
// Until then, you COULD NOT USE ES6 IMPORTS HERE. Or in anything that this imports.
// https://github.com/gatsbyjs/gatsby/issues/7810
export async function onPreBootstrap({ cache }, pluginOptions) {
  //const config = pluginOptions.config
  await processStyleResources(pluginOptions);
  await processIIFEFunction(pluginOptions);
}
/*
exports.onPostBuild = async function onPostBuild(nodeOptions, pluginOptions) {
  console.log("onPostBuild " + JSON.stringify({
    nodeOptions,
    pluginOptions
  }, null, 2))
}
*/

//global variables via webpack
//https://github.com/gatsbyjs/gatsby/issues/26676
/*
exports.onCreateWebpackConfig = ({ stage, actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        global: {
          HSB_1: JSON.stringify("Hello"),
          HSB_2: JSON.stringify("World"),
        }
      }),
    ],
  })
}
*/
// Coming soon: This formats plugin options and gives users useful info if its wrong.

/*
exports.pluginOptionsSchema = ({ Joi }) => {
    return Joi.object({
      classNameDark: Joi.string()
        .default('dark-mode')
        .description('CSS class name applied in dark mode'),
      classNameLight: Joi.string()
        .default('light-mode')
        .description('CSS class name applied in light mode'),
      storageKey: Joi.string()
        .default('darkMode')
        .description('localStorage key used to persist mode'),
      minify: Joi.boolean()
        .default(true)
        .description('toggle minification of the injected script'),
    });
  };
  */
