import React from "react"
import * as mystyles from "./StyleDetail.module.css"

const StyleDetail3 = ({ nameVal, value }) => {
    return (
        <div className={`${mystyles.styleSheetSummaryCardDetail} style-sheet-summary-card-detail`}>
            {nameVal} {value}
        </div>
    )
}

export default StyleDetail3
