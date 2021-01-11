import React from "react";
import styles from "./LedSection.module.css";

const LedSection = (props) => {
  const {
    name,
    detectValue,
    percent,
    onSetPercent,
    mainColor,
    changeColor,
  } = props;
  return (
    <div
      className={styles.LedSection}
      style={{
        backgroundColor: percent >= detectValue ? changeColor : mainColor,
      }}
    >
      <div className={styles.Led} onClick={() => onSetPercent(detectValue)}>
        {name} {detectValue * 10}
      </div>
    </div>
  );
};

export default LedSection;
