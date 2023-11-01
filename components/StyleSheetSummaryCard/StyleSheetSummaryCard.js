import React, { useContext, useState, useLayoutEffect } from "react"
import * as styles from "./StyleSheetSummaryCard.module.css"
import { HSBStyleContext } from "../../contexts/HSB_Context"

const Detail = (props) => {
  return (
    <div key={props.key} className={`${styles.styleSheetSummaryCardDetail} style-sheet-summary-card-detail`}>
      {props.name} {props.value}
    </div>
  )
}

const StyleSheetSummaryCard = ({ cardNum, styleSheet }) => {

  return (
    <div className={`${styles.styleSheetSummaryCardDiv} style-sheet-summary-card-div`}>
      <div className={`${styles.styleSheetSummaryCardTitle} style-sheet-summary-card-title-div`}><h5>{cardNum}: {styleSheet.dataset.hsbDisplayname}</h5><hr /></div>
      <div className={`${styles.styleSheetSummaryCardDetailsDiv} style-sheet-summary-card-details-div`}>
        <Detail key={styleSheet.dataset.hsbKey + "-enabled"} name="Enabled:" value={
          styleSheet.disabled ? "no" : <span className={`${styles.checkMark}`}>&#10004;</span>
        } />
        <Detail key={styleSheet.dataset.hsbKey + "-media"} name="Media Query:" value={
          styleSheet.media ?
            <>
              <span className={`${styles.warningSign}`}>&#9888;</span>
              <div>{styleSheet.media} </div>
            </>
            : "none"
        } />
        {styleSheet.href ? (
          <Detail key={styleSheet.dataset.hsbKey + "-href"} name="Style From Link:" value={[
            <a href={`${styleSheet.href}`}>View Here</a>
          ]}
          />
        ) : (
          <Detail key={styleSheet.dataset.hsbKey + "-href"} name="Style Embedded in Head." />
        )}
        <Detail key={styleSheet.dataset.hsbKey + "-always-enable"} name="Always Enable:" value={styleSheet.dataset.hsbAlwaysEnabled} />
        <Detail key={styleSheet.dataset.hsbKey + "-hsbuses"} name="HSB Uses:" value={styleSheet.dataset.hsbUses} />
        <Detail key={styleSheet.dataset.hsbKey + "-hsbkey"} name="HSB Key:" value={styleSheet.dataset.hsbKey} />
      </div>
    </div>
  )
}

export default StyleSheetSummaryCard
