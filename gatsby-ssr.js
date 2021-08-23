import fs from "fs"
import { HSBStyleContextProvider } from "./contexts/HSB_Context"
import { getBrowserFunctionScriptTag, injectBrowserFunctionIntoTopOfBody} from "./ssr/IIFEFactory"
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
let browserFunctionComponent = null;
let styleComponents = null;

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  getPreBodyComponents,
  replacePreBodyComponents
  
}, pluginOptions) => {

  lazyInit(pluginOptions)
  injectBrowserFunctionIntoTopOfBody( browserFunctionComponent, getPreBodyComponents, replacePreBodyComponents )  
  injectStylesIntoHead(styleComponents, getHeadComponents, replaceHeadComponents)

}

const lazyInit = (pluginOptions) => {

  if(!config){

    console.info("HSB: gatsby-ssr lazyInit(): config was null, so loading needed resources...")
    
    config = pluginOptions.config    
    browserFunctionComponent = getBrowserFunctionScriptTag(config, fs)
    styleComponents = getStyleComponents(config, fs)
    
  }
}




