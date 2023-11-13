import React from "react";
import fs from "fs";
import { HSBStyleContextProvider } from "./contexts/HSB_Context";
import {
  getIIFEFunctionString,
  IIFEScriptComponent,
  injectIIFEComponentIntoTopOfBody,
} from "./ssr/IIFEFactory";
import {
  getStyleComponents,
  injectStylesIntoBottomOfHead,
} from "./ssr/StyleFactory";

export const wrapRootElement = ({ element }) => {
  return <HSBStyleContextProvider>{element}</HSBStyleContextProvider>;
};

// 1. You can only export onPreRenderHTML hook once per instance of gatsby-ssr.js.
// 2. onPreRenderHTML(): In "dev build" it only runs once. In "prod build", it runs once per page.
// 3. Loading our CSS files is expensive so we only want to read our files once then cache them.
// Unfortunately, we dont have access to pluginOptions until onPreRenderHTML() actually runs,
// not during compile time, so we have to lazy init the cache variables.

// REMINDER: pluginOptions are the ones set in gatsby-config.js for this plugin
// and contain the info we need to create our style objects in the head.
let pluginConfig = null;
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
  lazyInit(pluginOptions);

  // we want our styles to be below any others, so we put them at the end of the head
  injectStylesIntoBottomOfHead(
    styleComponents,
    getHeadComponents,
    replaceHeadComponents
  );

  // Our IIFE could be put below the styles in the head but we put it just below the body tag.
  // Why? It runs immediately wherever we put it and will make 1 or more style sheets active.
  // If they are not completely loaded, the page will look bad.
  // So we put our IIFE at the top of the body (aka preBody) because the body only renders
  // after the head components render.
  injectIIFEComponentIntoTopOfBody(
    IIFEScriptComponent(iifeFunctionString),
    getPreBodyComponents,
    replacePreBodyComponents
  );
};

const lazyInit = pluginOptions => {
  if (!pluginConfig) {
    console.info(
      "HSB: gatsby-ssr lazyInit(): pluginConfigs was null, so loading needed resources..."
    );

    pluginConfig = pluginOptions.config;

    styleComponents = getStyleComponents(pluginConfig, fs);

    iifeFunctionString = getIIFEFunctionString(pluginConfig, fs);
  }
};
