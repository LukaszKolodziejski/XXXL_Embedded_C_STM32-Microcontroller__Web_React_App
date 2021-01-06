import React, { useState, useEffect } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import axios from "./axios-data";
import "./App.css";

const App = () => {
  const [reciveTextStm32, setReciveTextStm32] = useState("Recive text");
  const [serialPort, setSerialPort] = useState(null);
  const [zipPercent, setZipPercent] = useState(0);
  const [data, setData] = useState({
    leds: {
      ID: 1,
      name: "LDR1",
      type: "R",
      state: 1,
    },
  });

  useEffect(() => {
    // axios
    //   .post("/leds.json", data)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
    axios
      .get("/leds.json")
      .then((res) => {
        setReciveTextStm32(res.data.name);
        console.log(JSON.stringify(res.data));
      })
      .catch((err) => console.log(err));
  }, [data]);

  async function getReader() {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    setSerialPort(port);

    // Recive
    while (port.readable) {
      const reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // |reader| has been canceled.
            break;
          }
          const textDecoder = new TextDecoder("utf-8").decode(value);
          console.log("textDecoder");
          // console.log(textDecoder);
          console.log("<<<<<<<<<<<");
          setReciveTextStm32(textDecoder);
        }
      } catch (error) {
      } finally {
        reader.releaseLock();
      }
    }
    await port.close();
  }

  async function writeToStream(value) {
    const newData = {
      ID: 1,
      name: value,
      type: "R",
      state: 1,
    };

    setData({ leds: newData });
    axios.put("/leds.json", newData).then((res) => {
      setReciveTextStm32(res.data.name);
      console.log(JSON.stringify(res.data));
    });

    const encoder = new TextEncoder();
    const writer = serialPort.writable.getWriter();
    await writer.write(encoder.encode(JSON.stringify(newData)));
    writer.releaseLock();
  }

  const streamHandler = (value) => {
    serialPort ? writeToStream(value) : setReciveTextStm32("Click Start !!!");
  };

  const keyDownHandler = (key) => {
    if (key === "up") {
      setZipPercent((prevData) => (prevData < 100 ? prevData + 1 : prevData));
      console.log(key);
    } else if (key === "down") {
      setZipPercent((prevData) => (prevData > 0 ? prevData - 1 : prevData));
      console.log(key);
    }
  };

  return (
    <div className="App">
      <header className="App-header" onKeyPress={keyDownHandler}>
        <button className="Start" onClick={getReader}>
          Start
        </button>
        <KeyboardEventHandler
          handleKeys={["up", "down"]}
          onKeyEvent={keyDownHandler}
        />
        <div className="LedSections">
          <div className="Percent">{zipPercent}%</div>
          <div className="Modifier">
            <div
              className="Zip"
              style={{ marginTop: `${50 - zipPercent / 2}vh` }}
            ></div>
          </div>
        </div>
        <div className="LedSections">
          <div className="Recive">{reciveTextStm32}</div>
          <br />
          <div className="LedSection">
            <div className="Led" onClick={() => streamHandler("LDR1")}>
              RED On
            </div>
            <div className="Led" onClick={() => streamHandler("LDR0")}>
              RED Off
            </div>
          </div>
          <div className="LedSection">
            <div className="Led" onClick={() => streamHandler("LDB1")}>
              Blue On
            </div>
            <div className="Led" onClick={() => streamHandler("LDB0")}>
              Blue Off
            </div>
          </div>
          <div className="LedSection">
            <div className="Led" onClick={() => streamHandler("LDG1")}>
              Green On
            </div>
            <div className="Led" onClick={() => streamHandler("LDG0")}>
              Green Off
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
