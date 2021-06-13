import React, { useContext } from "react"
import * as styles from "./HSB.module.css"
import { HSBStyleContext } from "gatsby-head-style-boss/contexts/HSB_Context"
import { isSSR } from "gatsby-head-style-boss/utils/helpers"

const PrefersDarkMode = () => {
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model

  return (
    <span className={ `prefers-dark-mode-status ${styles.prefers_dark_mode_status}` }>
      Prefers Dark Mode ={" "}
      {!isSSR() && model.darkQuery.matches ? "true" : "false"}.
    </span>
  )
}

export default PrefersDarkMode