import React, { createContext, useState, useEffect } from "react"

// The HSBModel may not be available at this point, 
// or might not be populated yet, so empty object on init.
export const HSBStyleContext = createContext({})

export const HSBStyleContextProvider = (element) => {
  // This gets called when page loads or reloads,
  // or when something changes the model state, which calls updateModel()
  // **IF** in Gatsby *production* mode, page reload is called on each new page.
  // Then context reinitializes accurately, but components dont redraw 
  // because React can't tell HSBModel changed.
  // So I add a timestamp to make sure the data changes enough to trigger rerender on subscribers.
  const getHSBModel = () => {
    const newState = {
      timestamp: Date.now(),
      model: global.window?.__HSBModel || {},
    }
    return newState
  }

  // NOTE: every time that setHSBModel is called, React calls useState right after that.
  const [HSBModel, setHSBModel] = useState(getHSBModel())

  const updateModel = () => {
    setHSBModel(getHSBModel())
  }

  useEffect(() => {
    global.window.__HSBModel.modelStateChanged = updateModel
  })

  return (
    <HSBStyleContext.Provider value={{ HSBModel, updateModel }}>
      {element.children}
    </HSBStyleContext.Provider>
  )

}

/* this is for Gatsby to use to wrap the root element */
/*
export const HSBStyleContextElementWrapper = ({ element }) => (
  <HSBStyleContextProvider>{element}</HSBStyleContextProvider>
)
*/