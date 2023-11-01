import React, { useContext, useState, useLayoutEffect } from "react"
import * as styles from "./DarkModeToggle.module.css"
import DarkModeButton from "../DarkModeButton"
import MoonIconSolid from "./MoonIconSolid"
import SunIconSolid from "./SunIconSolid"

const DarkModeToggle = () => {

  // This is a premade dark mode toggle.
  // Make your own passing in your own icons.
  return (
    <DarkModeButton lightIcon={<SunIconSolid />} darkIcon={<MoonIconSolid />} />
  )
}

export default DarkModeToggle
