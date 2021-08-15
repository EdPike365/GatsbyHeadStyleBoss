import { getLinkPreloaderComponent, getLinkComponent } from "./LinkComponentFactory"
import { getStyleComponent } from "./StyleComponentFactory"

export const getStyleComponents = (config, fs) => {

    const stylesFolderURL = config.staticOutputFolder.replace("/static", "") + "/"
    console.log("HSB stylesFolderURL = " + stylesFolderURL)

    const styleComponents = [];
    config.styleConfigs.forEach(styleConfig => {
        if(styleConfig.componentType === "LINK" ){
            styleComponents.push(getLinkPreloaderComponent(styleConfig, stylesFolderURL))
            styleComponents.push(getLinkComponent(styleConfig, stylesFolderURL))
        }else{
            styleComponents.push(getStyleComponent(styleConfig, fs)) 
        }
    })
    return styleComponents;
}

export const injectStylesIntoHead = (
    styleComponents,
    getHeadComponents,
    replaceHeadComponents
  ) => {
  
    const headComps = getHeadComponents()
    const newHeadComps = [].concat(headComps, styleComponents)
    replaceHeadComponents(newHeadComps)

}

