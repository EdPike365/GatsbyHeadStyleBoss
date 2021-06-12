import path from "path"
import * as configFile from "./hsb-config.json"

export const getConfig = (fs, pluginGatsbyFolderPath, configFileName) => {
    let config = getCustomConfigFile(fs, pluginGatsbyFolderPath, configFileName)
    if(!config){
        config = getDefaultConfigFile()
    }
    return config
}

const getCustomConfigFile = (fs, pluginGatsbyFolderPath, configFileName) => {
    let config = null
    let rawData = null
    let filePath = ""
    try {

        filePath = path.join(pluginGatsbyFolderPath, configFileName)

        if( fs.existsSync(filePath)){
            console.log("HSB: getCustomConfigFile() using custom config file at path " + path.resolve(filePath))    
            rawData = fs.readFileSync(filePath)
            fs.close
            config = JSON.parse(rawData) //one op per line
   
        }else{
            console.log("HSB: getCustomConfigFile() NO custom config file at path " + path.resolve(filePath))
        }

    } catch (err) {
        console.error("HSB: getCustomConfigFile: " + err)
        fs.close
        console.log("HSB: getCustomConfigFile() error opening file at path " + path.resolve(filePath))
        //throw (err)
    }

    return config
}
  
const getDefaultConfigFile = () => {
    return configFile
}
  
  