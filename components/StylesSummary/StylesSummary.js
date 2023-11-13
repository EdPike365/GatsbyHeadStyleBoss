import React from "react"
import * as styles from "./StylesSummary.module.css"
import TotalNumStyleSheets from "../TotalNumStyleSheets"
import StyleSheetsSummaryTable from "../StyleSheetsSummaryTable"

const StylesSummary = () => {

  return (
    <div className={`${styles.stylesSummaryDiv} styles-summary-div`} >
      <h4>HSB Style Model State</h4>
      Total Style Sheets: <TotalNumStyleSheets /><br />
      Shown in cascading order:<br />
      <StyleSheetsSummaryTable />
    </div>
  )
}

export default StylesSummary
