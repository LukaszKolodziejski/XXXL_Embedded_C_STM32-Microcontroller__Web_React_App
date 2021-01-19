import React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

const Keyboard = (props) => {
  const keyDownHandler = (key) => {
    if (key === "up") {
      props.onChangePercent((prevData) =>
        prevData + 3 <= 100 ? prevData + 3 : prevData
      );
    } else if (key === "down") {
      props.onChangePercent((prevData) =>
        prevData - 3 >= 0 ? prevData - 3 : prevData
      );
    }
  };
  return (
    <KeyboardEventHandler handleKeys={props.keys} onKeyEvent={keyDownHandler} />
  );
};

export default Keyboard;
