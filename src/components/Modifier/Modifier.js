import React from "react";
import styles from "./Modifier.module.css";

const Modifier = (props) => {
  return (
    <div className={styles.Modifier}>
      <div className={styles.Modifier__Percent}>{props.percent}%</div>
      <div className={styles.Modifier__Block}>
        <div
          className={styles.Modifier__Zip}
          style={{ marginTop: `${50 - props.percent / 2}vh` }}
        ></div>
      </div>
    </div>
  );
};

export default Modifier;
