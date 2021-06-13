import React, { useContext } from "react"
import * as styles from "./HSB.module.css"
import { HSBStyleContext } from "../contexts/HSB_Context"
import { isSSR } from "../utils/helpers"
import MoonIconSolid from "./MoonIconSolid"
import SunIconSolid from "./SunIconSolid"

const DarkModeToggle = () => {
    const { HSBModel } = useContext(HSBStyleContext)
    const model = HSBModel.model
  
    const isDark = () => {
      if (isSSR()) {
        return false
      } else {
        return model.isUsingADarkStyle()
      }
    }
  
    // This was an effort to keep the dark mode button from flashing
    // TODO try getting rid of it.
    const shouldNotDisplayYet = () => {
      const res = isSSR() || model === null
      return res
    }
  
    const handleClick = () => {
      if (!isSSR()) model.toggleDarkStyle()
    }
  
    let iconToRender
    if (shouldNotDisplayYet()) {
      iconToRender = null
    } else {
      if (isDark()) {
        iconToRender = <SunIconSolid />
      } else {
        iconToRender = <MoonIconSolid />
      }
    }
  
    return (
      <button onClick={handleClick} className={`dark-mode-button ${styles.dark_mode_button}` } >
        {iconToRender}
      </button>
    )
  }
  
  export default DarkModeToggle