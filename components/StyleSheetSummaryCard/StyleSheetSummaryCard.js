import React, { useContext, useState, useLayoutEffect } from "react"
import * as styles from "./StyleSheetSummaryCard.module.css"
import { HSBStyleContext } from "../../contexts/HSB_Context"

const Detail = ({ name, value }) => {
  return (
    <div className={`${styles.styleSheetSummaryCardDetail} style-sheet-summary-card-detail`}>
      {name} {value}
    </div>
  )
}

const StyleSheetSummaryCard = ({ cardNum, styleSheet }) => {

  return (
    <div key={styleSheet.dataset.hsbKey} className={`${styles.styleSheetSummaryCardDiv} style-sheet-summary-card-div`}>
      <div className={`${styles.styleSheetSummaryCardTitle} style-sheet-summary-card-title-div`}><h5>{cardNum}: {styleSheet.dataset.hsbDisplayname}</h5><hr /></div>
      <div className={`${styles.styleSheetSummaryCardDetailsDiv} style-sheet-summary-card-details-div`}>
        <Detail name="Enabled:" value={
          styleSheet.disabled ? "no" : <span className={`${styles.checkMark}`}>&#10004;</span>
        } />
        <Detail name="Media Query:" value={
          styleSheet.media ?
            <>
              <span className={`${styles.warningSign}`}>&#9888;</span>
              <div>{styleSheet.media} </div>
            </>
            : "none"
        } />
        {styleSheet.href ? (
          <Detail name="Style From Link:" value={[
            <a href={`${styleSheet.href}`}>View Here</a>
          ]}
          />
        ) : (
          <Detail name="Style Embedded in Head." />
        )}
        <Detail name="Always Enable:" value={styleSheet.dataset.hsbAlwaysEnabled} />
        <Detail name="HSB Uses:" value={styleSheet.dataset.hsbUses} />
        <Detail name="HSB Key:" value={styleSheet.dataset.hsbKey} />
      </div>
    </div>
  )
}

export default StyleSheetSummaryCard
