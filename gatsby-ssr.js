import fs from "fs"
import { HSBStyleContextProvider } from "./contexts/HSB_Context"
import { injectStylesIntoHead } from "./ssr/StyleElementFactory"
//import { getStyleElementsFromWebPack } from "./ssr/StyleElementFactoryWP"
import { getStyleElements } from "./ssr/StyleElementFactory"
//import { getStyleLinks } from "./ssr/StyleLinkFactory"
import { getBrowserFunction, injectBrowserFunctionIntoTopOfBody} from "./ssr/browserFunctionFactory"

export const wrapRootElement = ({ element }) => {
  return (
    <HSBStyleContextProvider >{element}</HSBStyleContextProvider >
  )
}

const moduleSSRFolderPath = "node_modules/gatsby-head-style-boss/ssr"

let config = null;
let styleElements = null;
//let styleLinks = null;
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
    //styleElements = getStyleElementsFromWebPack(config)
    //styleElements = getStyleLinks(config)
    browserFunction = getBrowserFunction( fs, moduleSSRFolderPath, "./hsb-browser.js", config.minifyBrowserFunction )
  }

  injectStylesIntoHead(styleElements, getHeadComponents, replaceHeadComponents)
  injectBrowserFunctionIntoTopOfBody( browserFunction, getPreBodyComponents, replacePreBodyComponents )  
}

