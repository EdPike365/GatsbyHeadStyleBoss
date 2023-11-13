import { writeFile } from "fs"
import { join } from "path"
import { hsbFunctionString } from "./IIFEFunction.mjs"
import { minifyJSAsync } from "../utils/JSMinifier.mjs"
import { getCacheDir } from "../utils/fileUtils.mjs"

export const processIIFEFunction = async (config) => {

    if(doMinifyIIFE(config)){

        let functionString = hsbFunctionString //getIIFE()
        const beforeLength = functionString.length
        functionString = await minifyJSAsync(functionString)
        console.info(`HSB: Minified browserFunction. Before: ${beforeLength}, After: ${functionString.length}.`)

        // write to file
        const cacheFilePath = getIIFECachePath()
        writeFile(cacheFilePath, functionString, err => {
            if (err) {
                console.error(err)
                return
            }
        })

    }

}

export const doMinifyIIFE = (config) => {
    if(false == config.minifyBrowserFunction){
        return false
    }else{ 
        return true
    }
}

export const getIIFECachePath = () => {
    return join(getCacheDir(), "gatsby-head-style-boss", "iife-function.js")
}


