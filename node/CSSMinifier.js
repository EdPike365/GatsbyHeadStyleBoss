const postcss = require("postcss")
const defaultPreset = require("cssnano-preset-default")
const cssnano = require("cssnano")
const autoprefixer = require("autoprefixer")

//Everything in here is used by gatsby-node.js, so it has to be ES5 compliant (as of 7/2021)
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