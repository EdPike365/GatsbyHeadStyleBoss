import React from "react";
import { getLinkPublicURL } from "../node/CSSNodeUtils.mjs";

export const getLinkPreloaderComponent = styleConfig => {
  // The "key" attr keeps React happy, React makes it disappear at render time.
  const thisKey = "HSB_PRELOAD_" + styleConfig.key;
  const fileHREF = getFileHREF(styleConfig);

  return (
    <link
      rel="preload"
      as="style"
      href={fileHREF}
      key={thisKey}
      crossOrigin={styleConfig.crossorigin}
    />
  );
};

export const getLinkComponent = styleConfig => {
  // The "key" attr keeps React happy, React makes it disappear at render time.
  const thisKey = "HSB_" + styleConfig.key;
  const fileHREF = getFileHREF(styleConfig);
  const uses = styleConfig.uses ? styleConfig.uses : "";

  // we don't want these attributes to render if they are empty
  const title = styleConfig.title ? styleConfig.title : null;
  const media = styleConfig.media ? styleConfig.media : null;
  const crossorigin = styleConfig.crossorigin ? styleConfig.crossorigin : null;

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
  );
};

const getFileHREF = styleConfig => {
  if (styleConfig.remoteHREF) {
    if (styleConfig.cacheRemoteCSS) {
      // it was cached in local public/styles, and is accessible via a public URL
      return getLinkPublicURL(styleConfig);
    } else {
      return styleConfig.remoteHREF;
    }
  }
};
