import React from "react";

/*
  const lvl = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    TRACE: 5,
  };
*/

const IIFEDebugLevelScript = ({ debugLevelNum }) => {
  return (
    <script
      key="HSBIIFEDebugLevelScript"
      dangerouslySetInnerHTML={{
        __html: `
            window.__HSBiifeDebugLevel = ${debugLevelNum};
          `,
      }}
    />
  );
};

export default IIFEDebugLevelScript;
