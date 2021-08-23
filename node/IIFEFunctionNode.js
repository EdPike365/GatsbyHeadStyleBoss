const fs = require("fs")
const path = require("path")
const { getIIFE } = require("gatsby-head-style-boss/node/IIFEFunction")
const { minifyJSAsync } = require("../utils/JSMinifier")
const { getCacheDir } = require("../utils/fileUtils")

const processIIFEFunction = async (config) => {

    if(doMinifyIIFE(config)){

        let functionString = getIIFE()
        const beforeLength = functionString.length
        functionString = await minifyJSAsync(functionString)
        console.info(`HSB: Minified browserFunction. Before: ${beforeLength}, After: ${functionString.length}.`)

        // write to file
        const cacheFilePath = getIIFECachePath()
        fs.writeFile(cacheFilePath, functionString, err => {
            if (err) {
                console.error(err)
                return
            }
        })

    }

}

const doMinifyIIFE = (config) => {
    if(false == config.minifyBrowserFunction){
        return false
    }else{ 
        return true
    }
}

const getIIFECachePath = () => {
    return path.join(getCacheDir(), "gatsby-head-style-boss", "iife-function.js")
}

module.exports = {
    processIIFEFunction,
    doMinifyIIFE,
    getIIFECachePath
}
