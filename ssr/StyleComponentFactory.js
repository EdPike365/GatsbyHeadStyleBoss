import path from "path"
import { makeRandomNumberKey } from "gatsby-head-style-boss/utils/helpers"
import { getStringFromFileUTF8 } from "../utils/fileUtils"
// Terser.minify(css).code
/*
export const getStyleElements = (config, fs) => {

    const StyleElements = []
    // read the config content, then create a <style> element for each style config
    // one big loop to minimize RAM usage on SSR
    const stylesFolder = config.stylesFolder
    const styleConfigs = config.styleElements.styles
     
    styleConfigs.forEach(styleConfig => {
      const styleContent = getContentFromStyleConfig(styleConfig, stylesFolder, fs)
      const styleElement = getElementFromContent(styleContent) //one op per line
      StyleElements.push(styleElement)
    })

    return StyleElements
  }
*/
/*
  export const injectStylesIntoHead = (
    HSBStyleElements,
    getHeadComponents,
    replaceHeadComponents
  ) => {
  
    const headComps = getHeadComponents()
    const newHeadComps = [].concat(headComps, HSBStyleElements)
    replaceHeadComponents(newHeadComps)
    
  }
*/  
  
  export const getStyleComponent = (styleConfig, fs) => {

    const cssString = getCSSString(styleConfig, fs)
    // The "key" attr keeps React happy, React makes it disappear at render time.
    const type = "text/css"
    const thisKey = "HSB_" + styleConfig.key
    const uses = styleConfig.uses ? styleConfig.uses : ""
    const title = styleConfig.title ? styleConfig.title : ""

    return (
      <style
        type={type}
        data-hsb-managed="true"
        data-hsb-key={styleConfig.key}
        data-hsb-displayname={styleConfig.displayName}
        data-hsb-always-enabled={styleConfig.alwaysEnabled}
        data-hsb-uses={uses}       
        data-hsb-filename={styleConfig["data-filename"]}
        title={title}
        key={thisKey}
        dangerouslySetInnerHTML={{__html: cssString }}
      />
    )
  }

  const getCSSString = (styleConfig, fs) => {
  
    //const filePath = path.join(stylesFolder, styleConfig["data-filename"])
    console.log("HSB: getContentFromStyleConfig(): Loading css file: " + styleConfig.pathToCSSFile)
  
    let cssString = getStringFromFileUTF8(fs, styleConfig.pathToCSSFile)

    if(styleConfig.minify === true){
      //TODO cssString = minify(cssString)
    }

    return cssString
  }
  
  