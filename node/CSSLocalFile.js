const fs = require("fs")
const {getStringFromFileUTF8Sync } = require("gatsby-head-style-boss/utils/fileUtils")
const {minifyCSSAsync} = require("gatsby-head-style-boss/node/CSSMinifier")
const {getCacheFilePath} = require("gatsby-head-style-boss/node/NodeUtils")

const handleLocalCSSFile = async (styleConfig) => {
    const cssString = getStringFromFileUTF8Sync(styleConfig.pathToCSSFile)
    if(styleConfig.minify){
        console.info(`StyleFactoryNode: ${styleConfig.displayName} will be minified.`)

        // result is a quasi promise returned by postCSS. I cant use full await because it does not resolve properly.
        // postcss docs https://postcss.org/api/#lazyresult
        await minifyCSSAsync(cssString).then(result => {
            const miniCSS = result.css
            console.info(`HSB: minifyCSS(): "${styleConfig.displayName}": css length before: ${cssString.length} after: ${miniCSS.length}`)
            writeCSSToCacheFile(styleConfig, miniCSS)
        })

    }else{
        console.info(`StyleFactoryNode: ${styleConfig.displayName} will NOT be minified.`)
        writeCSSToCacheFile(styleConfig, cssString)
    }

}

const writeCSSToCacheFile = (styleConfig, cssString) => {
    
    const cacheFilePath = getCacheFilePath(styleConfig)

    fs.writeFile(cacheFilePath, cssString, err => {
        if (err) {
            console.error(err)
            return
        }
    })

}

module.exports = {
    handleLocalCSSFile,
    writeCSSToCacheFile
}