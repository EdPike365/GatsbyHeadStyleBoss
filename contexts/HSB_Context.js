import React, { createContext, useState, useLayoutEffect } from "react";

// The HSBModel may not be available at this point,
// or might not be populated yet, so empty object on init.
export const HSBStyleContext = createContext({});

export const HSBStyleContextProvider = element => {
  // All the state is in the HSBModel, but useState cannot see changes inside the object
  // So I create a meta state object and add a timestamp to make sure the data changes enough to trigger rerender on subscribers.
  // I tried managing it by merging the new state with the old state, but strange things were happening, e.g. random
  // model methods were not available on the new state object.
  const getHSBModel = () => {
    const newState = {
      timestamp: Date.now(),
      model: global.window?.__HSBModel || {},
    };
    return newState;
  };

  const [HSBModel, setHSBModel] = useState(getHSBModel());

  // This listens for HSB model change events
  //map the functions on first load.
  useLayoutEffect(() => {
    console.log("HSB: HSBStyleContextProvider: useLayoutEffect called");
    // we have to addEventListerner to the window, not document
    window.addEventListener("modelStateChanged", updateModel);
    return () => {
      window.removeEventListener("modelStateChanged", updateModel);
    };
  }, []);

  const updateModel = () => {
    console.log("HSB: HSBStyleContextProvider: updateModel() called");
    setHSBModel(getHSBModel());
  };

  return (
    <HSBStyleContext.Provider value={{ HSBModel, updateModel }}>
      {element.children}
    </HSBStyleContext.Provider>
  );
};
