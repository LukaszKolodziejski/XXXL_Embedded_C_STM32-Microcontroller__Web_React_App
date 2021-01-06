import React, { useState, useEffect } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import axios from "./axios-data";
import "./App.css";

const App = () => {
  const [lux, setLux] = useState(0);
  const [serialPort, setSerialPort] = useState(null);
  const [zipPercent, setZipPercent] = useState(23);
  const [data, setData] = useState({
    leds: {
      lux: 1000,
      percent: 100,
    },
  });
  // percent: 100,
  // ID: 1,
  // type: "R",
  // name: "LDR1",

  useEffect(() => {
    // axios
    //   .post("/leds.json", data)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
    axios
      .get("/leds.json")
      .then((res) => {
        setLux(res.data.lux);
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
          setLux(textDecoder);
        }
      } catch (error) {
      } finally {
        reader.releaseLock();
      }
    }
    await port.close();
  }

  async function writeToStream(newData) {
    const encoder = new TextEncoder();
    const writer = serialPort.writable.getWriter();
    await writer.write(encoder.encode(JSON.stringify(newData)));
    writer.releaseLock();
  }

  const keyDownHandler = (key) => {
    if (key === "up") {
      setZipPercent((prevData) => (prevData < 100 ? prevData + 1 : prevData));
      console.log(key);
    } else if (key === "down") {
      setZipPercent((prevData) => (prevData > 0 ? prevData - 1 : prevData));
      console.log(key);
    }
  };

  useEffect(() => {
    const newData = {
      ...data.leds,
      percent: zipPercent + 100,
    };
    setData({ leds: newData });

    const timer = setTimeout(() => {
      axios.put("/leds.json", newData).then((res) => {
        if (serialPort !== null) writeToStream(newData);
        console.log(JSON.stringify(res.data));
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [zipPercent]);

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
          <div className="Recive">{lux} lux</div>
          <br />
          <div className="LedSection">
            <div className="Led" onClick={() => setZipPercent(75)}>
              Red 75
            </div>
          </div>
          <div className="LedSection">
            <div className="Led" onClick={() => setZipPercent(50)}>
              Blue 50
            </div>
          </div>
          <div className="LedSection">
            <div className="Led" onClick={() => setZipPercent(25)}>
              Green 25
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
