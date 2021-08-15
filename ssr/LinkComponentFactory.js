import { getFileNameFromFilePath } from "../utils/fileUtils"

export const getLinkPreloaderComponent = (styleConfig, stylesFolderURL) => {

    // The "key" attr keeps React happy, React makes it disappear at render time.
    const thisKey = "HSB_PRELOAD_" + styleConfig.key
    const fileHREF = getFileHREF(styleConfig, stylesFolderURL)

    return (
        <link
            rel="preload"
            as="style"
            href={fileHREF}
            key={thisKey}
        />
    )
}

export const getLinkComponent = (styleConfig, stylesFolderURL) => {

    // The "key" attr keeps React happy, React makes it disappear at render time.
    const thisKey = "HSB_" + styleConfig.key
    const fileHREF = getFileHREF(styleConfig, stylesFolderURL)
    const uses = styleConfig.uses ? styleConfig.uses : ""
    const title = styleConfig.title ? styleConfig.title : ""

    return (
        <link
            rel="stylesheet"
            data-hsb-managed="true"
            data-hsb-key={thisKey}
            data-hsb-displayname={styleConfig.displayName}
            data-hsb-always-enabled={styleConfig.alwaysEnabled}
            data-hsb-uses={uses}
            href={fileHREF}
            title={title}
            key={thisKey}
        />
    )
}

const getFileHREF = (styleConfig, stylesFolderURL) => {
    if(styleConfig.remoteHREF){
        //TODO styleConfig.cacheRemoteHREF, minify?
        return styleConfig.remoteHREF
    }else{
        if(styleConfig.staticFileNameOverride){
            //staticFileNameOverride lets you change the name of the output file 
            return stylesFolderURL + styleConfig.staticFileNameOverride
        }else{
            const fileName = getFileNameFromFilePath(styleConfig.pathToCSSFile)
            return (stylesFolderURL + fileName);
        }
    }
}

