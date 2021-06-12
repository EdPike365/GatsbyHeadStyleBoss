import * as React from "react"
import path from "path"
import { minifyCSSString, minifyJSString, makeRandomNumberKey } from "../utils/HSB_Helpers"

export const getHSBConfigFromFile = (fs, pluginGatsbyFolderPath, configFileName) => {

  let rawData = null
  try {
    const filePath = path.join(pluginGatsbyFolderPath, configFileName)
    console.log("getHSBConfigFromFile() opening file at path " + path.resolve(filePath))
    rawData = fs.readFileSync(filePath)
    fs.close
  } catch (err) {
    console.error("HSB_Utils getHSBConfigFromFile: " + err)
    fs.close
    console.log("getHSBConfigFromFile() error opening file at path " + path.resolve(filePath))
    //throw (err)
  }

  const HSBConfig = JSON.parse(rawData) //one op per line
  return HSBConfig

}

export const getHSBStyleElements = (HSBConfig, fs) => {

  const HSBStyleElements = []
  // read the config content, then create a <style> element for each style config
  // one big loop to minimize RAM usage on SSR
  HSBConfig.styleElements.styles.forEach(styleConfig => {
    const styleDef = getDefFromConfig(styleConfig, HSBConfig.stylesFolder, fs)
    const styleElement = getElementFromDef(styleDef, HSBConfig.minifyCSS) //one op per line
    HSBStyleElements.push(styleElement)
  })
  return HSBStyleElements
}

const getDefFromConfig = (styleConfig, stylesFolder, fs) => {

  const filePath = path.join(stylesFolder, styleConfig["data-filename"])
  console.log("HSB_Utils.getDefFromConfig(): Loading css file: " + filePath)

  let cssString = ""
  try {
    cssString = fs.readFileSync(filePath, "utf-8")
    fs.close
  } catch (err) {
    console.error(
      "HSB_Utils.getDefFromConfig(): Could not find css file " + filePath + ". Check json config file."
    )
    console.error(err)
    fs.close
    throw(err)
  }

  styleConfig.content = cssString
  return styleConfig
}

const getElementFromDef = (styleDef, minifyCSS) => {
  // Having to use styleDef["data-xyz"] because field names have dashes.
  // They have dashes because they are non-standard attributes and React wont render theme
  // unless they are prefixed with "data-"
  // The key attr keeps React happy, React makes it disappear at render time.
  // The data-key is to be able to pass it in to the on page element so we can look it up for debug
  // The dangerouslySetInnerHTML is there, instead of {content}, because React escapes the " in your CSS (HTML) into &quote, for security reasons(?)
  const myKey = makeRandomNumberKey()
  
  let content = styleDef.content
  //TODO! implement minfication, the method below does not work, need a library
  //if(true) content = minifyCSSString(content)

  return (
    <style
      data-filename={styleDef["data-filename"]}
      data-displayname={styleDef["data-displayname"]}
      data-use={styleDef["data-use"]}
      data-key={myKey}
      key={myKey}
      id={styleDef.id}
      title={styleDef.title}
      type={styleDef.type}
      dangerouslySetInnerHTML={{__html: content}}
    />

  )
}

export const getHSBPageFunction = (fs, customJSFilePath, pluginGatsbyFolderPath, clientJSFileName, minifyJS) => {

  let jsString = null
  try {
    let pathToFile = ""
    
    if(customJSFilePath){
      console.log("getHSBPageFunction() using custom file path: " + customJSFilePath)
      pathToFile = customJSFilePath
    }else{
      pathToFile = path.join(pluginGatsbyFolderPath, clientJSFileName)
    } 

    if( fs.existsSync(pathToFile) ){
      jsString = fs.readFileSync(pathToFile, "utf-8")
      fs.close
    }else{
      console.log("getHSBPageFunction() file at path did not exist: " + pathToFile)
    }

  } catch (err) {
    console.error("gatsby-ssr.js getHSBPageFunction(): " + err)
    fs.close
    throw(err)
  }

  if(minifyJS){
    jsString = minifyJSString(jsString)
  } 

  function createDangerMarkup(jsString) {
    return { __html: jsString }
  }

  // add key attr to suppress React warning
  return <script key={makeRandomNumberKey} dangerouslySetInnerHTML={createDangerMarkup(jsString)} />
}

export const injectHSBStylesIntoHead = (
  HSBStyleElements,
  getHeadComponents,
  replaceHeadComponents
) => {

  const headComps = getHeadComponents()
  const newHeadComps = [].concat(headComps, HSBStyleElements)
  replaceHeadComponents(newHeadComps)
  
}

export const injectHSBClientJSIntoTopOfBody = (
  HSBPageFunction,
  getPreBodyComponents,
  replacePreBodyComponents
) => {

  const bodyComps = getPreBodyComponents()
  // make sure HSB stuff is on top
  const newBodyComps = [].concat(HSBPageFunction, bodyComps)
  replacePreBodyComponents(newBodyComps)

}


