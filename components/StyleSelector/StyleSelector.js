import React, { useContext, useState, useEffect } from "react"
import * as styles from "./StyleSelector.module.css"
import { HSBStyleContext } from "../../contexts/HSB_Context"

const getStyleOptions = (model) => {
  const options = []
  model.optionalStyles.forEach( style => {
    const thisOption = {
      key: style.dataset.hsbKey,
      value: style.dataset.hsbKey,
      label: style.dataset.hsbDisplayname,
    }
    options.push(thisOption)
  })
  return options;
}

const getSelectedStyleKey = (model) => {
  const arr = model.getEnabledOptionalStyles()
  return (arr.length > 0) ? arr[arr.length - 1].dataset.hsbKey : ""
}

const StyleSelector = () => {
    const { HSBModel } = useContext(HSBStyleContext)
    const model = HSBModel.model
    const [styleOptions, setStyleOptions] = useState([])
    const [selectedOptionValues, setSelectedOptionValues] = useState(undefined)

    useEffect(() => {
      setStyleOptions(getStyleOptions(model))
    }, [])

    useEffect(() => {
      setSelectedOptionValues(getSelectedStyleKey(model))
    }, [HSBModel])

    const handleChange = (evt) => {
      model.setStyleByKey(evt.target.value)
    }
      
    return (
      <select value={selectedOptionValues} onChange={handleChange} className={`style-selector ${styles.style_selector}`} >
        {styleOptions.map((option) => 
          <option key={option.key} value={option.value} >{option.label}</option>
        )}
      </select>
    )
  }
  
  export default StyleSelector