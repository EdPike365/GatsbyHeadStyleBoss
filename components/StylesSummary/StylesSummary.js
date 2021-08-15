import React, { useContext, useState, useEffect } from "react"
import * as cssStyle from "./StylesSummary.module.css"
import { HSBStyleContext } from "../../contexts/HSB_Context"

const StylesSummary = () => {
  const { HSBModel } = useContext(HSBStyleContext)
  const model = HSBModel.model

  const [styles, setStyles] = useState([])

  useEffect( () => {
    setStyles(model.managedStyles)
  }, [HSBModel])
    
  return (
    <div className={ `styles-summary ${cssStyle.styles_summary}` } >
      <h4>HSB Style Model State</h4>
      Styles: {styles.length}
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Display Name</th>
            <th>Enabled</th>
            <th>Always</th>
            <th>Uses</th>
            <th>HREF</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(styles).map(style => (
            <tr key={style.dataset.hsbKey}>
              <td>{style.dataset.hsbKey}</td>
              <td>{style.dataset.hsbDisplayname}</td>
              <td>{style.disabled ? "no" : "yes"}</td>
              <td>{style.dataset.hsbAlwaysEnabled}</td>
              <td>{style.dataset.hsbUses}</td>
              <td>{style.href}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StylesSummary
