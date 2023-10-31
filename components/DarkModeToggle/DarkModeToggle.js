import React, { useContext, useState, useLayoutEffect } from "react"
import * as styles from "./DarkModeToggle.module.css"
import { HSBStyleContext } from "../../contexts/HSB_Context"
import MoonIconSolid from "./MoonIconSolid"
import SunIconSolid from "./SunIconSolid"

const DarkModeToggle = () => {
    
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model
  
  const [showSunIcon, setShowSunIcon] = useState(false)

    useLayoutEffect( () => {
      model.isUsingADarkStyle() ? setShowSunIcon(true) : setShowSunIcon(false)
    }, [HSBModel])

    const handleClick = () => {
      model.toggleDarkStyle()
    }

    return (
      <button id="darkModeToggle" onClick={handleClick} aria-label={"Dark Mode Toggle"} className={`${styles.dark_mode_toggle} dark-mode-toggle` } >
        {showSunIcon ? <SunIconSolid /> : <MoonIconSolid/> }
      </button>
    )
  }
  
  export default DarkModeToggle
