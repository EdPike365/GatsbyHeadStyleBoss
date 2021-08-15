import React, { useContext, useState, useEffect } from "react"
import * as styles from "./DarkModeToggle.module.css"
import { HSBStyleContext } from "gatsby-head-style-boss/contexts/HSB_Context"
import MoonIconSolid from "./MoonIconSolid"
import SunIconSolid from "./SunIconSolid"

const DarkModeToggle = () => {
    
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model
  
  const [showSunIcon, setShowSunIcon] = useState(false)

    useEffect( () => {
      model.isUsingADarkStyle() ? setShowSunIcon(true) : setShowSunIcon(false)
    }, [HSBModel])

    const handleClick = () => {
      model.toggleDarkStyle()
    }

    return (
      <button onClick={handleClick} aria-label={"Dark Mode Toggle"} className={`dark-mode-toggle ${styles.dark_mode_toggle}` } >
        {showSunIcon ? <SunIconSolid /> : <MoonIconSolid/> }
      </button>
    )
  }
  
  export default DarkModeToggle