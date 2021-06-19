const fs = require("fs")
const path = require("path")
const webPackManager = require("./ssr/WebPackManager")

exports.onPreBootstrap = ({ cache }, pluginOptions) => {

  const dir = cache.directory

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const config = pluginOptions.config
  webPackManager.putStylesInCache(config, dir, fs)
  
}

exports.onCreateWebpackConfig = ({ actions, cache }, pluginOptions) => {
  const config = pluginOptions.config
  /*
    
  const aliasList = webPackManager.getCacheAliasList(config, cache.directory)

  const { setWebpackConfig } = actions
  setWebpackConfig({
    resolve: {
      alias: aliasList
    },
  })
  */
 
  const cacheFile = path.join(cache.directory, "test.js")
  const { setWebpackConfig } = actions
  setWebpackConfig({
    resolve: {
      alias: {
        "HeadStyleBossID_test": cacheFile,
      }
    },
  })

  console.log("!!!!!!alias HeadStyleBossID_test = test.js in cache.dir " + cache.directory)
}


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