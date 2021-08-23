const postcss = require("postcss")
const defaultPreset = require("cssnano-preset-default")
const cssnano = require("cssnano")
const autoprefixer = require("autoprefixer")

// process() returns a pseudo promise, so normal resolve does not work
const minifyCSSAsync = (cssString) => {
        
    //const preset = defaultPreset({ discardComments: false });
    const preset = defaultPreset({ });
    const plugins = [cssnano({ preset, plugins: [autoprefixer] })]
    const processOptions = { from: undefined }
    return postcss(plugins).process(cssString, processOptions)

}

module.exports = {
    minifyCSSAsync
}