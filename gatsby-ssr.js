import fs from "fs"
import { HSBStyleContextProvider } from "./contexts/HSB_Context"
import { getBrowserFunctionScriptTag, injectBrowserFunctionIntoTopOfBody} from "./ssr/BrowserFunction"
import { getStyleElements, injectStylesIntoHead } from "gatsby-head-style-boss/ssr/styleElementFactory"

export const wrapRootElement = ({ element }) => {
  return (
    <HSBStyleContextProvider >{element}</HSBStyleContextProvider >
  )
}

const moduleSSRFolderPath = "node_modules/gatsby-head-style-boss/ssr"

let config = null;
let styleElements = null;
let browserFunction = null;

// You can only export this hook once per instance of gatsby-ssr.js.
// onPreRenderHTML(): In dev build it only runs once. In prod build, it runs once per page.
// So we only want to load our file reads once. Loading is expensive.
export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  getPreBodyComponents,
  replacePreBodyComponents
  
}, pluginOptions) => {
  
  if(!config){
    console.log("HSB: gatsby-ssr: config was null, loading resources...")
    config = pluginOptions.config
    styleElements = getStyleElements(config, fs)
    browserFunction = getBrowserFunctionScriptTag()
  }

  injectStylesIntoHead(styleElements, getHeadComponents, replaceHeadComponents)
  injectBrowserFunctionIntoTopOfBody( browserFunction, getPreBodyComponents, replacePreBodyComponents )  
}

