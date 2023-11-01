import React, { Fragment } from "react"
import * as styles from "./StyleSheetSummaryCard.module.css"
import StyleDetail from "./StyleDetail"

const StyleSheetSummaryCard = ({ cardNum, styleSheet }) => {

  return (
    <div className={`${styles.styleSheetSummaryCardDiv} style-sheet-summary-card-div`}>
      <div className={`${styles.styleSheetSummaryCardTitle} style-sheet-summary-card-title-div`}><h5>{cardNum}: {styleSheet.dataset.hsbDisplayname}</h5><hr /></div>
      <div className={`${styles.styleSheetSummaryCardDetailsDiv} style-sheet-summary-card-details-div`}>
        <StyleDetail key={styleSheet.dataset.hsbKey + "Enabled"} nameVal="Enabled:" value={
          styleSheet.disabled ? "no" : <span className={`${styles.checkMark}`}>&#10004;</span>
        } />
        <StyleDetail key={styleSheet.dataset.hsbKey + "Media"} nameVal="Media Query:" value={
          styleSheet.media ?
            <>
              <span className={`${styles.warningSign}`}>&#9888;</span>
              <div>{styleSheet.media} </div>
            </>
            :
            <>
              none
            </>
        } />
        {styleSheet.href ? (
          <StyleDetail key={styleSheet.dataset.hsbKey + "HREF"} nameVal="Style From Link:" value={[
            <a key="suppressTheDamnKeyWarning" href={`${styleSheet.href}`}>View Here</a>
          ]}
          />
        ) : (
          <StyleDetail key={styleSheet.dataset.hsbKey + "HREF"} nameVal="Style Embedded in Head." />
        )}
        <StyleDetail key={styleSheet.dataset.hsbKey + "AlwaysEnable"} nameVal="Always Enable:" value={styleSheet.dataset.hsbAlwaysEnabled} />
        <StyleDetail key={styleSheet.dataset.hsbKey + "HSBUses"} nameVal="HSB Uses:" value={styleSheet.dataset.hsbUses} />
        <StyleDetail key={styleSheet.dataset.hsbKey + "HSBKey"} nameVal="HSB Key:" value={styleSheet.dataset.hsbKey} />
      </div>
    </div>
  )
}

export default StyleSheetSummaryCard
