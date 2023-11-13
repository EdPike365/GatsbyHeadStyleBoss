import React, { useContext, useState, useLayoutEffect } from "react";
import * as styles from "./StyleSheetsSummaryTable.module.css";
import { HSBStyleContext } from "../../contexts/HSB_Context";

const StyleSheetsSummaryTable = () => {
  const { HSBModel } = useContext(HSBStyleContext);
  const model = HSBModel.model;

  const [styleSheets, setStyleSheets] = useState([]);

  useLayoutEffect(() => {
    setStyleSheets(model.managedStyles);
  }, [HSBModel, model]);

  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Display Name</th>
          <th>Enabled</th>
          <th>Always</th>
          <th>Media</th>
          <th>Uses</th>
          <th>HREF</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(styleSheets).map((styleSheet, index) => (
          <tr key={styleSheet.dataset.hsbKey}>
            <td>
              {index + 1}: {styleSheet.dataset.hsbDisplayname}
            </td>
            <td>{styleSheet.dataset.hsbKey}</td>
            <td>{styleSheet.disabled ? "no" : "yes"}</td>
            <td>{styleSheet.dataset.hsbAlwaysEnabled}</td>
            <td>{styleSheet.media}</td>
            <td>{styleSheet.dataset.hsbUses}</td>
            <td>{styleSheet.href}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StyleSheetsSummaryTable;
