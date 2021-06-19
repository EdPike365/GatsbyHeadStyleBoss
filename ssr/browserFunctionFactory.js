import * as React from "react"
import path from "path"
import { minifyJSString } from "gatsby-head-style-boss/utils/helpers"
// Terser.minify(jsString).code

export const getBrowserFunction = (fs, moduleSSRFolderPath, browserFunctionFileName, minifyJS) => {
 
  let jsString = getBrowserFunctionFromFile(fs, "", browserFunctionFileName)
  if(jsString ){
    console.log("HSB: found and using custom browser function file")
  }else{
    jsString = getBrowserFunctionFromFile(fs, moduleSSRFolderPath, browserFunctionFileName)
  }
  
  if(minifyJS){
    jsString = minifyJSString(jsString)
  } 

  // add "key" attr to suppress React warning
  return <script key="gatsby-head-style-boss" dangerouslySetInnerHTML={{ __html: jsString }} />
}

const getBrowserFunctionFromFile = (fs, folderPath, browserFunctionFileName) => {
  let jsString = null
  try {
    
    const filePath = path.join(folderPath, browserFunctionFileName)
    
    if(fs.existsSync(filePath)){
      jsString = fs.readFileSync(filePath, "utf-8")
      fs.close
    }else{
      console.warn("HSB: getBrowserFunctionFromFile() no file at: " + filePath)
    }

  } catch (err) {
    console.error("HSB: getBrowserFunctionFromFile(): " + err)
    fs.close
    throw(err)
  }

  return jsString
}

export const injectBrowserFunctionIntoTopOfBody = (
  pageFunction,
  getPreBodyComponents,
  replacePreBodyComponents
) => {

  const bodyComps = getPreBodyComponents()
  // make sure HSB function is on top
  const newBodyComps = [].concat(pageFunction, bodyComps)
  replacePreBodyComponents(newBodyComps)

}



