import React, { useContext } from "react"
import * as styles from "./HSB.module.css"
import { HSBStyleContext } from "../contexts/HSB_Context"
import { isSSR } from "../utils/HSB_Helpers"
import MoonIconSolid from "./MoonIconSolid"
import SunIconSolid from "./SunIconSolid"

export const DarkModeToggle = () => {
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

export const StyleSelector = () => {
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model
 
  function getSelectedStyleID() {
    let styleID = ""
    if (!isSSR()) {
      const lastEnabledStyle = model.getLastEnabledOptionalStyle()
      if (lastEnabledStyle) styleID = lastEnabledStyle.id
    }
    return styleID
  }

  const getStyleOptions = () => {
    const selectedStyleID = getSelectedStyleID()
    // this node array is not iterable, has to be converted to normal array
    // TODO try map, etc.
    let styleArray = Array.from(model.getOptionalStyles())

    const styleOptions = []
    for (var i = 0; i < styleArray.length; i++) {
      const styleEl = styleArray[i]
      const thisOption = {
        key: styleEl.dataset.key,
        label: styleEl.dataset.displayname,
        value: styleEl.id,
      }
      if (styleEl.id === selectedStyleID) {
        thisOption.selected = "selected"
      }

      styleOptions.push(thisOption)
    }

    return styleOptions
  }

  const getSelectOptions = () => {
    const styleOptions = getStyleOptions()
    //Setting "selected" attribute makes React poop a big red warning --in Gatsby dev--
    //However, if I use the recommended approach instead, -- if I'm in Gatsby PROD--, --if I reload the page--
    //the select draws the original version, which has nothing selected.
    //I tried everything to make it rerender. useState, useEffect. useState would be accurate
    //but the select WOULD NOT RERENDER to reflect the state because technically the state had not changed
    const options = styleOptions.map(option => {
      return (
        <option key={option.value} value={option.value} selected={option.selected}>
          {option.label}
        </option>
      )
    })
    return options
  }

  function handleChange(e) {
    model.setHSBStyleByID(e.target.value)
  }

  let selectOptions = []
  if (!isSSR()) {
    selectOptions = getSelectOptions()
  }

  return (
    <select onChange={handleChange} className={`style-selector ${styles.style_selector}`} >
      {selectOptions}
    </select>
  )
}

export const StylesSummary = () => {
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model

  const myStyles = isSSR() ? [] : model.styles
  
  return (
    <div className={ `styles-summary ${styles.styles_summary}` } >
      <h4>HSB Style Model State</h4>
      idPrefix: "{model.idPrefix}".
      <br />
      Styles: {myStyles.length}
      <table>
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Uses</th>
            <th>Enabled</th>
            <th>FileName</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(myStyles).map(style => (
            <tr key={style.dataset.filename}>
              <td>{style.dataset.displayname}</td>
              <td>{style.dataset.use}</td>
              <td>{style.disabled ? "no" : "yes"}</td>
              <td>{style.dataset.filename}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const PrefersDarkMode = () => {
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model

  return (
    <span className={ `prefers-dark-mode-status ${styles.prefers_dark_mode_status}` }>
      Prefers Dark Mode ={" "}
      {!isSSR() && model.darkQuery.matches ? "true" : "false"}.
    </span>
  )
}
