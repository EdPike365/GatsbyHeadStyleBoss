import path from "path"
import { makeRandomNumberKey } from "gatsby-head-style-boss/utils/helpers"
// Terser.minify(css).code

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

export const injectStylesIntoHead = (
  HSBStyleElements,
  getHeadComponents,
  replaceHeadComponents
) => {

  const headComps = getHeadComponents()
  const newHeadComps = [].concat(headComps, HSBStyleElements)
  replaceHeadComponents(newHeadComps)
  
}
  
  const getContentFromStyleConfig = (styleConfig, stylesFolder, fs) => {
  
    const filePath = path.join(stylesFolder, styleConfig["data-filename"])
    console.log("HSB: getContentFromStyleConfig(): Loading css file: " + filePath)
  
    let cssString = ""
    try {
        if(fs.existsSync){
            cssString = fs.readFileSync(filePath, "utf-8")
            fs.close
        }else{
            console.warn(
                "HSB: getContentFromStyleConfig(): Could not find css file " + filePath + ". Check json config file."
                )
        }
    } catch (err) {
        console.error(err)
        fs.close
        throw(err)
    }
  
    if(styleConfig.minifyCSS === true){
      //TODO cssString = minify(cssString)
    }

    styleConfig.content = cssString
    return styleConfig
  }

 
  const getElementFromContent = (styleContent) => {

    // Having to use styleContent["data-xyz"] because field names have dashes.
    // They have dashes because they are non-standard attributes and React wont render theme
    // unless they are prefixed with "data-"
    // The "key" attr keeps React happy, React makes it disappear at render time.
    // The "data-key" is to be able to pass it in to the on page element
    // so we can look it up for debug.
    const myKey = makeRandomNumberKey()
    const title = ""
    const type = "text/css"

    return (
      <style
        data-filename={styleContent["data-filename"]}
        data-displayname={styleContent["data-displayname"]}
        data-use={styleContent["data-use"]}
        data-key={myKey}
        key={myKey}
        id={styleContent.id}
        title={title}
        type={type}
        dangerouslySetInnerHTML={{__html: styleContent.content }}
      />
    )
  }
  
