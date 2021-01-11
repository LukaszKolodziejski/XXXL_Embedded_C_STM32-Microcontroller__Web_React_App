import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

const Keyboard = (props) => {
  const keyDownHandler = (key) => {
    if (key === "up") {
      props.onChangePercent((prevData) =>
        prevData < 100 ? prevData + 2.5 : prevData
      );
    } else if (key === "down") {
      props.onChangePercent((prevData) =>
        prevData > 0 ? prevData - 2.5 : prevData
      );
    }
  };
  return (
    <KeyboardEventHandler handleKeys={props.keys} onKeyEvent={keyDownHandler} />
  );
};

export default Keyboard;
