import React, { useContext } from "react"
import * as styles from "./HSB.module.css"
import { HSBStyleContext } from "gatsby-head-style-boss/contexts/HSB_Context"
import { isSSR } from "gatsby-head-style-boss/utils/helpers"

const StylesSummary = () => {
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

export default StylesSummary
