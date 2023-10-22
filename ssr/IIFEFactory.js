import React from "react"
import { doMinifyIIFE, getIIFECachePath } from "../node/IIFEFunctionNode.mjs"
import { getStringFromFileUTF8SyncFS } from "../utils/fileUtils.mjs"
import { hsbFunctionString } from "../node/IIFEFunction.mjs"

export const IIFEScriptComponent = (iifeString) => {

    //return <script key="HSBBrowserFunction" dangerouslySetInnerHTML={{ __html: iifeString }} />
    // eslint-disable-next-line react/no-danger
    return (
        <script key="HSBBrowserFunction" dangerouslySetInnerHTML={{ __html: iifeString }} />
    )

}

// the old way
export const IIFEFunctionScript = (config, fs) => {

    let iifeString
    if (doMinifyIIFE(config)) {
        //read the file 
        iifeString = getIIFEFromCache(fs)
    } else {
        //it is not minified, so pull in directly from js file
        //it is a string in the form of `(${functionString})()`
        //where functionString is the function HSBFunction() from IIFEFunction.js
        iifeString = getIIFEString()
    }

    // eslint-disable-next-line react/no-danger
    return <script key="HSBBrowserFunction" dangerouslySetInnerHTML={{ __html: iifeString }} />

}

// This occurs here because if we export the function, and someone imports it, it will not auto execute
// TODO test importing the function directly to make sure above comment is true
export const getIIFEFunctionString = (pluginConfig, fs) => {

    let functionString
    if (doMinifyIIFE(pluginConfig)) {
        //minifying will leave it a file 
        functionString = getIIFEStringFromCache(fs)
    } else {
        //it is not minified, so pull in directly from js file
        functionString = hsbFunctionString
    }

    // Wrap it in an IIFE
    const iifeFunctionString = `(${functionString})()`
    //return `(${functionString})()`
    return iifeFunctionString

}

// This is cached because it may be minified, which writes it to a file
// and we dont want to read that over and over
const getIIFEStringFromCache = (fs) => {

    const pathToIIFEFile = getIIFECachePath()
    return getStringFromFileUTF8SyncFS(fs, pathToIIFEFile)

}

export const injectIIFEComponentIntoTopOfBody = (
    IIFEScriptComponent,
    getPreBodyComponents,
    replacePreBodyComponents
) => {

    const bodyComps = getPreBodyComponents()
    // make sure HSB function is on top
    const newBodyComps = [].concat(IIFEScriptComponent, bodyComps)
    replacePreBodyComponents(newBodyComps)

}