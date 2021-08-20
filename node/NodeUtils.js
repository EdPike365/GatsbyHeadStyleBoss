const path = require("path")
const {getFileNameFromFilePath, insertStringBeforeExtension, getCacheDir, getPublicDir} = require("../utils/fileUtils")
const {getFileNameFromURL} = require("../utils/netUtils")

const getStylesCacheDir = () => {
    return path.join(getCacheDir(), "gatsby-head-style-boss", "styles")
}

const getCacheFilePath = (styleConfig) =>{
    const cacheFileName = getCSSFileName(styleConfig)
    return path.join(getStylesCacheDir(), cacheFileName )
}

const getLinkStylesDir = () => {
    return path.join(getPublicDir(), "styles")
}
  
const getLinkFilePath = (styleConfig) =>{
    const fileName = getCSSFileName(styleConfig)
    return path.join(getLinkStylesDir(), fileName )
}

const getCSSFileName = (styleConfig) => {

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

module.exports = {
    getStylesCacheDir,
    getLinkStylesDir,
    getCacheFilePath,
    getLinkFilePath,
    getCSSFileName

}