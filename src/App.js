import React, { useState, useEffect } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";
import axios from "./axios-data";
import "./App.css";

const App = () => {
  const [lux, setLux] = useState(0);
  const [zipPercent, setZipPercent] = useState(50);
  const [serialPort, setSerialPort] = useState(null);

  useEffect(() => {
    axios
      .get("/leds.json")
      .then((res) => {
        setLux(res.data.lux);
        setZipPercent(res.data.percent);
      })
      .catch((err) => console.log(err));
  }, []);

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
          const jsonData = JSON.parse(textDecoder);
          setLux(jsonData.lux);
          setZipPercent(jsonData.percent);
          axios.put("/leds.json", jsonData);
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
    } else if (key === "down") {
      setZipPercent((prevData) => (prevData > 0 ? prevData - 1 : prevData));
    }
  };

  useEffect(() => {
    const newData = {
      lux: lux + 1000,
      percent: zipPercent + 100,
    };

    const timer = setTimeout(() => {
      axios.put("/leds.json", { lux, percent: zipPercent }).then((res) => {
        if (serialPort !== null) writeToStream(newData);
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [zipPercent]);

  return (
    <div className="App">
      <header className="App-header" onKeyPress={keyDownHandler}>
        <button
          className="Start"
          onClick={getReader}
          disabled={serialPort ? true : false}
        >
          {serialPort ? "Connected" : "Start"}
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
