import React from "react";
import fs from "fs";
import { HSBStyleContextProvider } from "./contexts/HSB_Context";
import IIFEDebugLevelScript from "./ssr/IIFEDebugLevelScript";
import * as IIFEFactory from "./ssr/IIFEFactory";
import * as StyleFactory from "./ssr/StyleFactory";

export const wrapRootElement = ({ element }) => {
  return <HSBStyleContextProvider>{element}</HSBStyleContextProvider>;
};

/*
export const onRenderBody = ({ setPreBodyComponents }, pluginOptions) => {
  const iifeDebugLevel = JSON.stringify(pluginOptions.iifeDebugLevel);
  console.info(
    "HSB: gatsby-ssr onRenderBody(): iifeDebugLevel = " + iifeDebugLevel
  );

  // Create a new component that sets the variable on the window object
  const ScriptComponent = () => (
    <script
      dangerouslySetInnerHTML={{
        __html: `
        window.__HSBiifeDebugLevel = ${iifeDebugLevel};
      `,
      }}
    />
  );

  // Use the setPreBodyComponents function to add this component to the body of each page
  setPreBodyComponents(<ScriptComponent />);
};
*/

// 1. You can only export onPreRenderHTML hook once per instance of gatsby-ssr.js.
// 2. onPreRenderHTML(): In "gatsby dev" it only runs once. In "gatsby prod", it runs once per page.
// 3. Loading our CSS files is expensive so we only want to read our files once then cache them.
// Unfortunately, we dont have access to pluginOptions until onPreRenderHTML() actually runs,
// not during compile time, so we have to singleton cache the variables on the first call.

let iifeFunctionString = null;
let styleComponents = null;

// REMINDER: preBodyComponents are the ones that go right after the <body> tag.
// The "pre" is misleading.
export const onPreRenderHTML = (
  {
    getHeadComponents,
    replaceHeadComponents,
    getPreBodyComponents,
    replacePreBodyComponents,
  },
  pluginOptions
) => {
  cacheResources(pluginOptions);

  let iifeDebugLevel = pluginOptions.iifeDebugLevel;
  if (null == iifeDebugLevel) {
    console.warn(
      "HSB: gatsby-ssr onPreRenderHTML(): iifeDebugLevel is null! Set in gatsby-config.js. Defaulting to 2 (info)."
    );
    iifeDebugLevel = 2;
  }
  console.info(
    "HSB: gatsby-ssr onPreRenderHTML: iifeDebugLevel = " + iifeDebugLevel
  );

  // we want our styles to be below any others, so we put them at the end of the head
  injectComponentsIntoBottomOfHead(
    iifeDebugLevel,
    styleComponents,
    getHeadComponents,
    replaceHeadComponents
  );

  // Our IIFE could be put below the styles in the head but we put it just below the body tag.
  // Why? It runs immediately wherever we put it and will make 1 or more style sheets active.
  // If they are not completely loaded, the page will look bad.
  // So we put our IIFE at the top of the body (aka preBody) because the body only renders
  // after the head components containing the styles render.
  IIFEFactory.injectIIFEComponentIntoTopOfBody(
    iifeFunctionString,
    getPreBodyComponents,
    replacePreBodyComponents
  );
};

const cacheResources = pluginOptions => {
  if (null == styleComponents) {
    styleComponents = StyleFactory.getStyleComponents(
      pluginOptions.styleConfigs,
      fs
    );
  }

  if (null == iifeFunctionString) {
    iifeFunctionString = IIFEFactory.getIIFEFunctionString(
      pluginOptions.minifyBrowserFunction,
      fs
    );
  }
};

const injectComponentsIntoBottomOfHead = (
  iifeDebugLevelNum,
  styleComponents,
  getHeadComponents,
  replaceHeadComponents
) => {
  const headComps = getHeadComponents();
  const newHeadComps = [].concat(
    headComps,
    <IIFEDebugLevelScript debugLevelNum={iifeDebugLevelNum} />,
    styleComponents
  );
  replaceHeadComponents(newHeadComps);
};
