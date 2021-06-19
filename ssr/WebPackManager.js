const path = require(`path`)

const putStylesInCache = (config, cacheDir, fs) => {
    const stylesFolder = config.stylesFolder
    const styleConfigs = config.styleElements.styles

    styleConfigs.forEach(styleConfig => {
        const fileContent = getContentFromFileUTF8(fs, stylesFolder, styleConfig["data-filename"])
        const cacheFile = path.join(cacheDir, styleConfig["data-filename"])
        console.info("HSB: putStylesInCache(): writing " + cacheFile)
        fs.writeFileSync(cacheFile, fileContent)
    })

    const fileToCache = path.join(stylesFolder, "test.js")
    const cachedFile = path.join(cacheDir, "test.js")
    fs.copyFileSync(fileToCache, cachedFile)

}

const getContentFromFileUTF8 = (fs, folder, fileName) => {
  
    const filePath = path.join(folder, fileName)
    console.log("HSB: getContentFromFile(): Loading file: " + filePath)

    let fileContent = ""
    try {
        if(fs.existsSync){
            fileContent = fs.readFileSync(filePath, "utf-8")
            fs.close
        }else{
            console.warn(
                "HSB: getContentFromFile: Could not find file " + filePath + ". Check json config file."
                )
        }
    } catch (err) {
        console.error(err)
        fs.close
        throw(err)
    }

    return fileContent
}

const getCacheAliasList = (config, cacheDir) => {
    const aliasList = {}
    const styleConfigs = config.styleElements.styles

    styleConfigs.forEach(styleConfig => {
        const aliasName = styleConfig["id"] 
        const cacheFile = path.join(cacheDir, styleConfig["data-filename"])
        console.info("getCacheAliasList() alias: " + aliasName + " to cacheFile " + cacheFile)
        aliasList[aliasName] = cacheFile
    })

    return aliasList

}

module.exports = { putStylesInCache, getCacheAliasList}


