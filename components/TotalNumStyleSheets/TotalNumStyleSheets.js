import React, { useContext, useState, useLayoutEffect } from "react"
import * as styles from "./TotalNumStyleSheets.module.css"
import { HSBStyleContext } from "../../contexts/HSB_Context"

const TotalNumStyleSheets = () => {

  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model

  const [styles, setStyles] = useState([])

  useLayoutEffect(() => {
    setStyles(model.managedStyles)
  }, [HSBModel, model])

  return (
    <span className={`num-style-sheets`} >{styles.length}</span>
  )
}

export default TotalNumStyleSheets
