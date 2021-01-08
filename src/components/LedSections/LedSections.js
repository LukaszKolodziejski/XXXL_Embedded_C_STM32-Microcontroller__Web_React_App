import React from "react";
import styles from "./LedSections.module.css";
import * as color from "../../constant/color";
import LedSection from "./LedSection/LedSection";

const LedSections = (props) => {
  const { lux, percent, onSetPercent } = props;
  return (
    <div className={styles.LedSections}>
      <div className={styles.Lux}>{lux} lux</div>
      <LedSection
        name="Red"
        detectValue={75}
        percent={percent}
        onSetPercent={onSetPercent}
        mainColor={color.brown}
        changeColor={color.red}
      />
      <LedSection
        name="Blue"
        detectValue={50}
        percent={percent}
        onSetPercent={onSetPercent}
        mainColor={color.brown}
        changeColor={color.blue}
      />
      <LedSection
        name="Green"
        detectValue={25}
        percent={percent}
        onSetPercent={onSetPercent}
        mainColor={color.brown}
        changeColor={color.green}
      />
    </div>
  );
};

export default LedSections;
