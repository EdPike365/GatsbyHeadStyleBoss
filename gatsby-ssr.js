import fs from "fs"
import { HSBStyleContextProvider } from "./contexts/HSB_Context"
import {
  getHSBConfigFromFile,
  getHSBStyleElements,
  getHSBPageFunction,
  injectHSBStylesIntoHead,
  injectHSBClientJSIntoTopOfBody
} from "./gatsby/HSB_Utils"

export const wrapRootElement = ({ element }) => {
  return (
    <HSBStyleContextProvider >{element}</HSBStyleContextProvider >
  )
}

// Pre load all the file system stuff because
// onPreRenderHTML, etc, runs once per page in prod, so would be big hit
const pluginGatsbyFolderPath = "plugins/head-style-boss/gatsby"
const configFileName = "./HSB_Config.json"
const clientJSFileName = "./HSB_Browser.js"
const HSBConfig = getHSBConfigFromFile(fs, pluginGatsbyFolderPath, configFileName)
const HSBStyleElements = getHSBStyleElements(HSBConfig, fs)
const HSBPageFunction = getHSBPageFunction( fs, HSBConfig.customJSFilePath, pluginGatsbyFolderPath, clientJSFileName, HSBConfig.minifyJS )

// you can only export this hook once
// in dev it only runs once. in prod, it runs once per page.
export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  getPreBodyComponents,
  replacePreBodyComponents,
}) => {
  injectHSBStylesIntoHead(HSBStyleElements, getHeadComponents, replaceHeadComponents)
  injectHSBClientJSIntoTopOfBody( HSBPageFunction, getPreBodyComponents, replacePreBodyComponents )  
}

