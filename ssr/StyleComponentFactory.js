import React from "react"
import { getStringFromFileUTF8SyncFS } from "../utils/fileUtils.mjs"
import {getCacheFilePath} from "../node/CSSNodeUtils.mjs"

export const getStyleComponent = (styleConfig, fs) => {

  const cssString = getCSSStringFromCache(styleConfig, fs)
    
  // The "key" attr keeps React happy, React makes it disappear at render time.
  const type = "text/css"
  const thisKey = "HSB_" + styleConfig.key
  const uses = styleConfig.uses ? styleConfig.uses : ""
  const title = styleConfig.title ? styleConfig.title : null
  const media = styleConfig.media ? styleConfig.media : null
  const crossorigin = styleConfig.crossorigin ? styleConfig.crossorigin : null

  return (
    <style
      type={type}
      data-hsb-displayname={styleConfig.displayName}
      data-hsb-managed="true"
      data-hsb-key={styleConfig.key}
      data-hsb-always-enabled={styleConfig.alwaysEnabled}
      data-hsb-uses={uses}       
      title={title}
      key={thisKey}
      media={media}
      crossOrigin={crossorigin}
      dangerouslySetInnerHTML={{__html: cssString }}
    />
  )
}

const getCSSStringFromCache = (styleConfig, fs) => {

  const pathToCSSFile = getCacheFilePath(styleConfig)
  return getStringFromFileUTF8SyncFS(fs, pathToCSSFile)

}


  
  