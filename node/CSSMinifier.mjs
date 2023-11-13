import postcss from "postcss"
import defaultPreset from "cssnano-preset-default"
import cssnano from "cssnano"
import autoprefixer from "autoprefixer"

// process() returns a pseudo promise, so normal resolve does not work
export const minifyCSSAsync = (cssString) => {
        
    //const preset = defaultPreset({ discardComments: false });
    const preset = defaultPreset({ });
    const plugins = [cssnano({ preset, plugins: [autoprefixer] })]
    const processOptions = { from: undefined }
    return postcss(plugins).process(cssString, processOptions)

}
