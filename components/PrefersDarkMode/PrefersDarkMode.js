import React, { useContext, useState, useEffect } from "react"
import * as styles from "./PrefersDarkMode.module.css"
import { HSBStyleContext } from "../../contexts/HSB_Context"

const PrefersDarkMode = () => {
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model

  const [prefersDark, setPrefersDark] = useState("")
  useEffect( () =>{
    setPrefersDark(model.darkQuery.matches ? "true" : "false")
  }, [HSBModel])

  return (
    <span className={ `prefers-dark-mode-status ${styles.prefers_dark_mode_status}` }>
      Prefers Dark Mode = {prefersDark}.
    </span>
  )
}

export default PrefersDarkMode