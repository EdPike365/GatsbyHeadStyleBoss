import fs from "fs"
import { HSBStyleContextProvider } from "./contexts/HSB_Context"
import { getBrowserFunctionScriptTag, injectBrowserFunctionIntoTopOfBody} from "./ssr/BrowserFunction"
import { getStyleComponents, injectStylesIntoHead } from "./ssr/StyleFactory"

export const wrapRootElement = ({ element }) => {
  return (
    <HSBStyleContextProvider >{element}</HSBStyleContextProvider >
  )
}

// 1. You can only export this hook once per instance of gatsby-ssr.js.
// 2. onPreRenderHTML(): In dev build it only runs once. In prod build, it runs once per page.
// 3. Loading is expensive so we only want to load our file reads once. 
// Unfortunately, we dont have acess to pluginOptions until onPreRenderHTML() runs,
// so we have to lazy init.
let config = null;
let styleComponents = null;
let browserFunction = null;

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  getPreBodyComponents,
  replacePreBodyComponents
  
}, pluginOptions) => {
  
  lazyInit(pluginOptions)

  injectStylesIntoHead(styleComponents, getHeadComponents, replaceHeadComponents)
  injectBrowserFunctionIntoTopOfBody( browserFunction, getPreBodyComponents, replacePreBodyComponents )  
}

const lazyInit = (pluginOptions) => {
  if(!config){
    console.log("HSB: gatsby-ssr lazyInit(): config was null, so loading needed resources...")
    config = pluginOptions.config
    browserFunction = getBrowserFunctionScriptTag(config.minifyBrowserFunction)
    styleComponents = getStyleComponents(config, fs)
  }
}




