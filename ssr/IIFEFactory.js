import {doMinifyIIFE, getIIFECachePath} from "../node/IIFEFunctionNode"
import {getIIFE} from "../node/IIFEFunction"
import {getStringFromFileUTF8SyncFS} from "../utils/fileUtils"

export const getBrowserFunctionScriptTag = (config, fs) => {
    
    let iifeString
    if(doMinifyIIFE(config)){
        //read the file 
        iifeString = getIIFEFromCache(fs)
    }else{
        //it is not minified, so pull in directly from js file
        iifeString = getIIFE()
    }
    
    // eslint-disable-next-line react/no-danger
    return <script key="HSBBrowserFunction" dangerouslySetInnerHTML={{ __html: iifeString }} />
  
}

const getIIFEFromCache = (fs) => {

    const pathToIIFEFile = getIIFECachePath()
    return getStringFromFileUTF8SyncFS(fs, pathToIIFEFile)
  
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