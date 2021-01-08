import React, { useState, useEffect } from "react";
import axios from "./axios-data";
import Keyboard from "./components/Keyboard";
import * as color from "./constant/color";
import Layout from "./layout/Layout";
import "./App.css";

const App = () => {
  const [lux, setLux] = useState(0);
  const [zipPercent, setZipPercent] = useState(50);
  const [serialPort, setSerialPort] = useState(null);
  const [activeState, setActiveState] = useState(true);

  useEffect(() => {
    let delay = 1100;
    setInterval(() => {
      delay = serialPort !== null ? 1100 : 500;
      if (activeState) {
        axios
          .get("/leds.json")
          .then((res) => res.data)
          .then(({ lux, percent }) => {
            setLux(lux);
            setZipPercent(percent);
          })
          .catch((err) => console.log(err));
      }
    }, delay);
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

  useEffect(() => {
    const newData = {
      lux: lux + 1000,
      percent: zipPercent + 100,
    };
    let delay = serialPort !== null ? 50 : 0;
    setActiveState(false);
    const timer = setTimeout(() => {
      axios.put("/leds.json", { lux, percent: zipPercent }).then((res) => {
        if (serialPort !== null) writeToStream(newData);
      });
    }, delay);
    setActiveState(true);
    return () => clearTimeout(timer);
  }, [zipPercent]);

  return (
    <Layout>
      <Keyboard keys={["up", "down"]} onChangePercent={setZipPercent} />
      <button
        className="Start"
        onClick={getReader}
        disabled={serialPort ? true : false}
      >
        {serialPort ? "Connected" : "Start"}
      </button>
      <div className="ModifierSections">
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
        <div
          className="LedSection"
          style={{
            // backgroundColor: zipPercent >= 75 ? redColor : brounColor,
            backgroundColor: zipPercent >= 75 ? color.red : color.broun,
          }}
        >
          <div className="Led" onClick={() => setZipPercent(75)}>
            Red 75
          </div>
        </div>
        <div
          className="LedSection"
          style={{
            backgroundColor: zipPercent >= 50 ? color.blue : color.broun,
          }}
        >
          <div className="Led" onClick={() => setZipPercent(50)}>
            Blue 50
          </div>
        </div>
        <div
          className="LedSection"
          style={{
            backgroundColor: zipPercent >= 25 ? color.green : color.broun,
          }}
        >
          <div className="Led" onClick={() => setZipPercent(25)}>
            Green 25
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
