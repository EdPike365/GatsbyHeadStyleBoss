import { makeRandomNumberKey } from "gatsby-head-style-boss/utils/helpers"
import coreCSS from "HeadStyleBossID_test"

export const getStyleElementsFromWebPack = (config) => {

  const StyleElements = []
  const styleConfigs = config.styleElements.styles
    
  styleConfigs.forEach(styleConfig => {
    const styleConfigWithContent = getContentFromWebPack(styleConfig)
    const styleElement = getElementFromContentWebPack(styleConfigWithContent) //one op per line
    StyleElements.push(styleElement)
  })


  return StyleElements
}

const getContentFromWebPack = (styleConfig) => {

    let cssString = ""
    /*
    await(
    const aliasName = styleConfig["id"] 
    import(aliasName).then((module) => {
      cssString = module
    }).catch( (error) =>{
      console.error("HSB getContentFromWebPack() " + error)
    })
    )
    */
//https://medium.com/front-end-weekly/webpack-and-dynamic-imports-doing-it-right-72549ff49234
    //import(/* webpackMode: "eager" */ `assets/images/${imageName}.jpg`)
    //import(/* webpackChunkName: "foo-image" */ "assets/images/foo.jpg");
    //import(/* webpackChunkName: "bar-module" */ "modules/bar");

console.info("!!!!!!coreCSS was " + coreCSS)
    styleConfig.content = {coreCSS}
    return styleConfig
}
  
  
  const getElementFromContentWebPack = (styleContent) => {

    // Having to use styleContent["data-xyz"] because field names have dashes.
    // They have dashes because they are non-standard attributes and React wont render theme
    // unless they are prefixed with "data-"
    // The "key" attr keeps React happy, React makes it disappear at render time.
    // The "data-key" is to be able to pass it in to the on page element
    // so we can look it up for debug.
    const myKey = makeRandomNumberKey()
    const title = ""
    const type = "text/css"
//        dangerouslySetInnerHTML={{__html: styleContent.content }}
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
        data-test={coreCSS}
        dangerouslySetInnerHTML={{__html: {coreCSS} }}
      />
    )
    
  }
  