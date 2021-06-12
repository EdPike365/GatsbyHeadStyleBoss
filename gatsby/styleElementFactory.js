import path from "path"
import { makeRandomNumberKey } from "gatsby-head-style-boss/utils/HSB_Helpers"

export const getStyleElements = (config, fs) => {

    const StyleElements = []
    // read the config content, then create a <style> element for each style config
    // one big loop to minimize RAM usage on SSR
    const stylesFolder = config.stylesFolder
    const styleConfigs = config.styleElements.styles
    const minifyCSS = config.minifyCSS    
    
    styleConfigs.forEach(styleConfig => {
      const styleContent = getContentFromStyleConfig(styleConfig, stylesFolder, fs)
      const styleElement = getElementFromContent(styleContent, minifyCSS) //one op per line
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
  
    styleConfig.content = cssString
    return styleConfig
  }
  
  const getElementFromContent = (styleContent, minifyCSS) => {
    // Having to use styleContent["data-xyz"] because field names have dashes.
    // They have dashes because they are non-standard attributes and React wont render theme
    // unless they are prefixed with "data-"
    // The key attr keeps React happy, React makes it disappear at render time.
    // The data-key is to be able to pass it in to the on page element so we can look it up for debug
    // The dangerouslySetInnerHTML is there, instead of {content}, because React escapes the " in your CSS (HTML) into &quote, for security reasons(?)
    const myKey = makeRandomNumberKey()
    
    let htmlContent = styleContent.content
    //TODO! implement minfication, the method below does not work, need a library
    //if(true) content = minifyCSSString(content)
  
    return (
      <style
        data-filename={styleContent["data-filename"]}
        data-displayname={styleContent["data-displayname"]}
        data-use={styleContent["data-use"]}
        data-key={myKey}
        key={myKey}
        id={styleContent.id}
        title={styleContent.title}
        type={styleContent.type}
        dangerouslySetInnerHTML={{__html: htmlContent}}
      />
  
    )
  }
  