import {
  getLinkPreloaderComponent,
  getLinkComponent,
} from "./LinkComponentFactory";
import { getStyleComponent } from "./StyleComponentFactory";

export const getStyleComponents = (styleConfigs, fs) => {
  const styleComponents = [];
  styleConfigs.forEach(styleConfig => {
    if (styleConfig.componentType === "LINK") {
      styleComponents.push(getLinkPreloaderComponent(styleConfig));
      styleComponents.push(getLinkComponent(styleConfig));
    } else {
      styleComponents.push(getStyleComponent(styleConfig, fs));
    }
  });
  return styleComponents;
};
