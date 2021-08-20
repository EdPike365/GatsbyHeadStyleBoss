const path = require("path")

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
    copyFileToStaticFolder
}