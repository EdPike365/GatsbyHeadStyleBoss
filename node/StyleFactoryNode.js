const fs = require("fs")
const {handleLocalCSSFile, handleRemoteHREF} = require("gatsby-head-style-boss/node/CSSLocalFile")
const {handleRemoteCSSHREF} = require("gatsby-head-style-boss/node/CSSRemoteFile")
const {getStylesCacheDir, getStylesStaticDir} = require("./NodeUtils")

//Everything in here is used by gatsby-node.js, so it has to be ES5 compliant (as of 7/2021)

const processStyleResources = async (config) => {

  const stylesCacheDir = getStylesCacheDir()
  if(!fs.existsSync(stylesCacheDir)){
    fs.mkdirSync(stylesCacheDir, {recursive: true}, err => { console.error(err)})
  }

  //TODO make parallel (change to map and async?)
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
 
module.exports = {
  processStyleResources
}