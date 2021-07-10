import React, { useContext, useState, useEffect, useMemo } from "react"
import * as styles from "./HSB.module.css"
import { HSBStyleContext } from "../contexts/HSB_Context"
import { isSSR } from "../utils/helpers"

const getStyleOptions = (model) => {
  const options = []
  model.getOptionalStyles().forEach( styleEl => {
    const thisOption = {
      key: styleEl.dataset.key,
      label: styleEl.dataset.displayname,
      value: styleEl.id,
    }
    options.push(thisOption)
  })
  return options;
}

const StyleSelector = () => {
    const { HSBModel } = useContext(HSBStyleContext)
    //TODO: get rid of timestamp hack so HSBModel is the actual model
    const model = HSBModel.model
    const styleOptions = isSSR() ? [] : useMemo(() => getStyleOptions(model), [model])
    const [selectedValue, setSelectedValue] = useState(undefined)

    useEffect(() => {
      setSelectedValue(getSelectedStyleID())
    })

    function handleChange(evt) {
      model.setHSBStyleByID(evt.target.value)
    }
  
    function getSelectedStyleID() {
      let styleID = ""
      const lastEnabledStyle = model.getLastEnabledOptionalStyle()
      if (lastEnabledStyle){ styleID = lastEnabledStyle.id }
      return styleID
    }
  
    return (
      <select value={selectedValue} onChange={handleChange} className={`style-selector ${styles.style_selector}`} >
        {styleOptions.map((option) => 
          <option key={option.value} value={option.value} >{option.label}</option>
        )}
      </select>
    )
  }
  
  export default StyleSelector