import path from "path"
import { makeRandomNumberKey } from "gatsby-head-style-boss/utils/helpers"

export const getStyleLinks = (config) => {
  const stylesFolder = config.stylesFolder
  const styleConfigs = config.styleElements.styles

  const styleLinks = []
    
  styleConfigs.forEach(styleConfig => {
    const styleLink = getElementFromContentWebPack(stylesFolder, styleConfig) //one op per line
    styleLinks.push(styleLink)
  })

  return styleLinks
}

  
  const getElementFromContentWebPack = (stylesFolder, styleConfig ) => {

    // Having to use styleContent["data-xyz"] because field names have dashes.
    // They have dashes because they are non-standard attributes and React wont render theme
    // unless they are prefixed with "data-"
    // The "key" attr keeps React happy, React makes it disappear at render time.
    // The "data-key" is to be able to pass it in to the on page element
    // so we can look it up for debug.
    //stylesFolder = "./src/styles/"
    const stylePath = path.join(stylesFolder, styleConfig["data-filename"] )
    console.info("!!!!!!getting style link from stylePath " + stylePath)
    //const styleURL = new URL("./src/styles/normalize2.css") 
    const myKey = makeRandomNumberKey()
    const title = ""
    const type = "text/css"
    return (
      <link
        rel="stylesheet"
        href={stylePath}
        data-filename={styleConfig["data-filename"]}
        data-displayname={styleConfig["data-displayname"]}
        data-use={styleConfig["data-use"]}
        data-key={myKey}
        key={myKey}
        id={styleConfig.id}
        title={title}
        type={type}
      />
    )
    
  }
  