import { getLinkPreloaderComponent, getLinkComponent } from "./LinkComponentFactory"
import { getStyleComponent } from "./StyleComponentFactory"

export const getStyleComponents = (config, fs) => {

    const styleComponents = [];
    config.styleConfigs.forEach(styleConfig => {
        if(styleConfig.componentType === "LINK" ){
            styleComponents.push(getLinkPreloaderComponent(styleConfig))
            styleComponents.push(getLinkComponent(styleConfig))
        }else{
            styleComponents.push(getStyleComponent(styleConfig, fs)) 
        }
    })
    return styleComponents
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

