import * as React from "react"
import path from "path"
import { minifyJSString, makeRandomNumberKey } from "gatsby-head-style-boss/utils/HSB_Helpers"

// I tried import * as jsFunction from "./hsb_browser.js".
// It caused the function code to be compiled (or something)
// which caused problems with global windows calls (at least). So I'm sticking with reading the default function file 
// from the node install folder.

export const getBrowserFunction = (fs, moduleGatsbyFolderPath, browserFunctionFileName, minifyJS) => {
 
  let jsString = getBrowserFunctionFromFile(fs, "", browserFunctionFileName)
  if(jsString ){
    console.log("HSB: found and using custom browser function file")
  }else{
    jsString = getBrowserFunctionFromFile(fs, moduleGatsbyFolderPath, browserFunctionFileName)
  }
  
  if(minifyJS){
    jsString = minifyJSString(jsString)
  } 

  // add key attr to suppress React warning
  return <script key={makeRandomNumberKey} dangerouslySetInnerHTML={createDangerMarkup(jsString)} />
}

const getBrowserFunctionFromFile = (fs, folderPath, browserFunctionFileName) => {
  let jsString = null
  try {
    
    const filePath = path.join(folderPath, browserFunctionFileName)
    
    if(fs.existsSync(filePath)){
      jsString = fs.readFileSync(filePath, "utf-8")
      fs.close
    }else{
      console.log("HSB: getBrowserFunctionFromFile() no file at: " + filePath)
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

function createDangerMarkup(jsString) {
  return { __html: jsString }
}


