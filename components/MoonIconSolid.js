import React from "react"
import * as styles from "./HSB.module.css"

const MoonIconSolid = () => {
  return (
    <svg
      className={`moon-icon ${styles.icon}`} 
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 283.211 512 c 78.962 0 151.079 -35.925 198.857 -94.792 c 7.068 -8.708 -0.639 -21.43 -11.562 -19.35 c -124.203 23.654 -238.262 -71.576 -238.262 -196.954 c 0 -72.222 38.662 -138.635 101.498 -174.394 c 9.686 -5.512 7.25 -20.197 -3.756 -22.23 A 258.156 258.156 0 0 0 283.211 0 c -141.309 0 -256 114.511 -256 256 c 0 141.309 114.511 256 256 256 Z"></path>
    </svg>
  )
}

export default MoonIconSolid
