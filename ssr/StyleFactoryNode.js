const path = require("path")
const {initAppFolder, getFileNameFromFilePath, copyFile} = require("../utils/fileUtils")
//Everything in here is used by gatsby-node.js, so it has to be ES5 compliant (as of 7/2021)

const positionStyleResources = (config, fs) => {

    const staticOutputFolder = initAppFolder(config.staticOutputFolder, fs)
  
    config.styleConfigs.forEach(styleConfig => {

      if(styleConfig.componentType === "LINK" ){
        console.info(`StyleConfig ${styleConfig.displayName} will be a LINK component.`)
        if(styleConfig.remoteHREF){
  
          // TODO: we could pull remoteHREF down, minify and store it in static folder
          // TODO: use gatsby Gatsby cache API or a plugin)
          console.info(`StyleConfig ${styleConfig.displayName} had an remoteHREF.`)
  
        }else{
          console.info(`StyleConfig ${styleConfig.displayName} had no remoteHREF, will try to move local css file to static folder.`)

          copyFileToStaticFolder(
            styleConfig.pathToCSSFile, 
            staticOutputFolder, 
            fs,
            styleConfig.staticFileNameOverride,
            styleConfig.minify 
          )
  
        }
      }else{
        console.info(`StyleConfig ${styleConfig.displayName} will be a STYLE component.`)
      }
    })
  }

  const copyFileToStaticFolder = (pathToCSSFile, staticOutputFolder, fs, staticFileNameOverride, minify) => {
    
    const sourcePath = path.join(process.cwd(), pathToCSSFile);
    const destinationPath = getDestinationPath(staticOutputFolder, staticFileNameOverride, pathToCSSFile)

    if(minify){
      // TODO if in gatsby cache, checksum, skip?
      // read content 
      // minify
      // write to destinationPath in new file
    }else{
      copyFile(fs, sourcePath, destinationPath)
    }
}

const getDestinationPath = (staticOutputFolder, staticFileNameOverride, pathToCSSFile) => {
     //if no staticFileName supplied, use filename from pathToCSSFile
    if(staticFileNameOverride){
      return path.join(staticOutputFolder, staticFileNameOverride);
    }else{
      const fileName = getFileNameFromFilePath(pathToCSSFile)
      //I'm assuming that you cant write to ths configs in gatsby-node and have it persist into gatsby-ssr
      //or I'd try persisting it somewhere 
      return path.join(staticOutputFolder, fileName);
    }
  }
 
module.exports = {
  positionStyleResources
}