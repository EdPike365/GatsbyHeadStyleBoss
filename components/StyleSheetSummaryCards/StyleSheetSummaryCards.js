import React, { useContext, useState, useLayoutEffect } from "react";
import * as styles from "./StyleSheetSummaryCards.module.css";
import { HSBStyleContext } from "../../contexts/HSB_Context";
import StyleSummaryCard from "../StyleSheetSummaryCard";

const StyleSummaryCards = () => {
  const { HSBModel } = useContext(HSBStyleContext);
  const model = HSBModel.model;

  const [styleSheets, setStyleSheets] = useState([]);

  useLayoutEffect(() => {
    setStyleSheets(model.managedStyles);
  }, [HSBModel, model]);

  return (
    <div>
      {Array.from(styleSheets).map((styleSheet, index) => (
        <StyleSummaryCard
          key={styleSheet.dataset.hsbKey}
          cardNum={index + 1}
          styleSheet={styleSheet}
        />
      ))}
    </div>
  );
};

export default StyleSummaryCards;
