import React from "react";
import styles from "./SerialPortBtn.module.css";

const SerialPortBtn = (props) => {
  return (
    <button
      className={styles.SerialPortBtn}
      onClick={props.onClickGetReader}
      disabled={props.connectSerialPort ? true : false}
    >
      {props.connectSerialPort ? "Connected" : "Start"}
    </button>
  );
};

export default SerialPortBtn;
