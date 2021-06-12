import fs from "fs"
import { HSBStyleContextProvider } from "./contexts/HSB_Context"
import { getConfig } from "./gatsby/configFactory"
import { getStyleElements, injectStylesIntoHead } from "./gatsby/styleElementFactory"
import { getBrowserFunction, injectBrowserFunctionIntoTopOfBody} from "./gatsby/browserFunctionFactory"

export const wrapRootElement = ({ element }) => {
  return (
    <HSBStyleContextProvider >{element}</HSBStyleContextProvider >
  )
}

// Pre load all the file system stuff because
// onPreRenderHTML, etc, runs once per page in prod, so would be big hit
const moduleGatsbyFolderPath = "node_modules/gatsby-head-style-boss/gatsby"

const config = getConfig(fs, "", "./hsb-config.json")
const styleElements = getStyleElements(config, fs)
const browserFunction = getBrowserFunction( fs, moduleGatsbyFolderPath, "./hsb-browser.js", config.minifyJS )

// you can only export this hook once
// in dev it only runs once. in prod, it runs once per page.
export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  getPreBodyComponents,
  replacePreBodyComponents,
}) => {
  injectStylesIntoHead(styleElements, getHeadComponents, replaceHeadComponents)
  injectBrowserFunctionIntoTopOfBody( browserFunction, getPreBodyComponents, replacePreBodyComponents )  
}

