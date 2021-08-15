const {positionStyleResources} = require("./ssr/StyleFactoryNode")
const fs = require("fs")
//TODO work with webpack in production-app.js for hot reload, etc
//https://www.gatsbyjs.com/docs/production-app/

// Until then, use same minification as Gatsby webpack
// Minify javascript using Terser (https://terser.org/)
// Minify CSS by using cssnano (https://cssnano.co/)

// webpack export stats?

//https://webpack.js.org/api/module-methods/#magic-comments

//TODO add <style data-href> https://www.gatsbyjs.com/docs/resource-handling-and-service-workers/
// and https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/cache-dir/static-entry.js#L311
//what is import { ForceCssHMRForEdgeCases } from "./webpack/force-css-hmr-for-edge-cases"

// WARNING: YOU CANNOT USE ES6 IMPORTS HERE. Or in anything that this imports.
// https://github.com/gatsbyjs/gatsby/issues/7810
exports.onPreBootstrap = ({ cache }, pluginOptions) => {
  const config = pluginOptions.config
  positionStyleResources(config, fs)
}


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