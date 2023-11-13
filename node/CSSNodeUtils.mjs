import { join } from "path"
import { getFileNameFromFilePath, insertStringBeforeExtension, getCacheDir, getPublicDir } from "../utils/fileUtils.mjs"
import { getFileNameFromURL } from "../utils/netUtils.mjs"

export const getStylesCacheDir = () => {
    return join(getCacheDir(), "gatsby-head-style-boss", "styles")
}

export const getCacheFilePath = (styleConfig) =>{
    const cacheFileName = getCSSFileName(styleConfig)
    return join(getStylesCacheDir(), cacheFileName )
}

export const getLinkStylesDir = () => {
    return join(getPublicDir(), "styles")
}
  
export const getLinkFilePath = (styleConfig) =>{
    const fileName = getCSSFileName(styleConfig)
    return join(getLinkStylesDir(), fileName )
}

export const getLinkPublicURL = (styleConfig) => {
    const fileName = getCSSFileName(styleConfig)
    const urlString = "/styles/" + fileName
    return urlString
}

export const getCSSFileName = (styleConfig) => {

    let fileName
    if(styleConfig.pathToCSSFile){
        fileName = getFileNameFromFilePath(styleConfig.pathToCSSFile)
    }else{
        fileName = getFileNameFromURL(styleConfig.remoteHREF)
    }

    if(styleConfig.minify === true){
        fileName = insertStringBeforeExtension(".min", fileName)
    } 

    return fileName
}
