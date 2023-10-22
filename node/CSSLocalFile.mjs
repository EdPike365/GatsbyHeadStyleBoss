import { writeFile } from "fs"
import { getStringFromFileUTF8Sync } from "../utils/fileUtils.mjs"
import { minifyCSSAsync } from "./CSSMinifier.mjs"
import { getCacheFilePath } from "./CSSNodeUtils.mjs"

export const handleLocalCSSFile = async (styleConfig) => {
    const cssString = getStringFromFileUTF8Sync(styleConfig.pathToCSSFile)
    if(styleConfig.minify){

        // result is a quasi promise returned by postCSS. 
        // I cant use full await because it does not resolve properly.
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

export const writeCSSToCacheFile = (styleConfig, cssString) => {
    
    const cacheFilePath = getCacheFilePath(styleConfig)

    writeFile(cacheFilePath, cssString, err => {
        if (err) {
            console.error(err)
            return
        }
    })

}

