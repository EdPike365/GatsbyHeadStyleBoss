import URL from "url"
import { getFileNameFromFilePath } from "../utils/fileUtils"
import {getLinkStylesDir, getLinkFilePath, getCSSFileName} from "gatsby-head-style-boss/node/NodeUtils"

export const getLinkPreloaderComponent = (styleConfig) => {

    // The "key" attr keeps React happy, React makes it disappear at render time.
    const thisKey = "HSB_PRELOAD_" + styleConfig.key
    const fileHREF = getFileHREF(styleConfig)

    return (
        <link
            rel="preload"
            as="style"
            href={fileHREF}
            key={thisKey}
        />
    )
}

export const getLinkComponent = (styleConfig) => {

    // The "key" attr keeps React happy, React makes it disappear at render time.
    const thisKey = "HSB_" + styleConfig.key
    const fileHREF = getFileHREF(styleConfig)
    const uses = styleConfig.uses ? styleConfig.uses : ""
    const title = styleConfig.title ? styleConfig.title : ""
    const media = styleConfig.media ? styleConfig.media : ""
    const crossorigin = styleConfig.crossorigin ? styleConfig.crossorigin : ""

    return (
        <link
            data-hsb-displayname={styleConfig.displayName}
            data-hsb-managed="true"
            data-hsb-key={styleConfig.key}
            data-hsb-always-enabled={styleConfig.alwaysEnabled}
            data-hsb-uses={uses}       
            rel="stylesheet"
            href={fileHREF}
            title={title}
            key={thisKey}
            media={media}
            crossOrigin={crossorigin}
        />
    )
}

const getFileHREF = (styleConfig) => {
    
    if(styleConfig.remoteHREF){
        if(styleConfig.cacheRemoteCSS){
            //this means it was put in local public/styles
            return getPublicLinkURL(styleConfig)
        }else{
            return styleConfig.remoteHREF
        }
    }

}

const getPublicLinkURL = (styleConfig) => {

    //const linkStylesDir = getLinkStylesDir()
    //const fileName = getCSSFileName(styleConfig)
    //const pathToCSSFile = path.link(linkStylesDir, fileName)

    //this will have .min added if compression happened
    const pathToCSSFile = getLinkFilePath(styleConfig)
    const parsedURL = new URL(pathToCSSFile, "/");
    console.log("Link URL " + parsedURL)
    return parsedURL
}

