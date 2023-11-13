import React, { useContext, useState, useLayoutEffect } from "react";
import * as styles from "./DarkModeButton.module.css";
import { HSBStyleContext } from "../../contexts/HSB_Context";

const DarkModeButton = props => {
  const { HSBModel } = useContext(HSBStyleContext);
  const model = HSBModel.model;

  const [showLightIcon, setShowLightIcon] = useState(false);

  useLayoutEffect(() => {
    model.isUsingADarkStyle()
      ? setShowLightIcon(true)
      : setShowLightIcon(false);
  }, [HSBModel]);

  const handleClick = () => {
    model.toggleDarkStyle();
  };

  return (
    <button
      id="darkModeToggle"
      onClick={handleClick}
      aria-label={"Dark Mode Toggle"}
      className={`${styles.darkModeButton} dark-mode-button`}
    >
      {showLightIcon ? props.lightIcon : props.darkIcon}
    </button>
  );
};

export default DarkModeButton;
