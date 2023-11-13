import { existsSync, mkdirSync } from "fs"
import { handleLocalCSSFile } from "./CSSLocalFile.mjs"
import { handleRemoteCSSHREF } from "./CSSRemoteFile.mjs"
import { getStylesCacheDir } from "./CSSNodeUtils.mjs"

//Everything in here is used by gatsby-node.js, so it has to be ES5 compliant (as of 7/2021)

export const processStyleResources = async (config) => {

  const stylesCacheDir = getStylesCacheDir()
  if(!existsSync(stylesCacheDir)){
    mkdirSync(stylesCacheDir, {recursive: true}, err => { console.error(err)})
  }

  //TODO make parallel (change to map and async?)
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
  config.styleConfigs.forEach(styleConfig => {
    if(styleConfig.pathToCSSFile){
      handleLocalCSSFile(styleConfig)
    }else if(styleConfig.remoteHREF){
      handleRemoteCSSHREF(styleConfig)
    }else{
      console.error("No css file or remoteHREF was given for style with key = " + styleConfig.key)
      return
    }
  })

}
 
