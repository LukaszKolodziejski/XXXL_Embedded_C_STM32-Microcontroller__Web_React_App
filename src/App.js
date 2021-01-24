import React, { useState, useEffect } from "react";
import axios from "./axios-data";
import Layout from "./layout/Layout";
import Keyboard from "./components/Keyboard";
import Modifier from "./components/Modifier/Modifier";
import LedSections from "./components/LedSections/LedSections";
import SerialPortBtn from "./components/SerialPortBtn/SerialPortBtn";

const App = () => {
  const [lux, setLux] = useState(0);
  const [zipPercent, setZipPercent] = useState(50);
  const [serialPort, setSerialPort] = useState(null);
  const [activeState, setActiveState] = useState(true);

  useEffect(() => {
    let delay = 1100;
    setInterval(() => {
      // delay = serialPort !== null ? 1100 : 500;
      delay = serialPort !== null ? 350 : 350;
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

  return (
    <Layout>
      <Keyboard keys={["up", "down"]} onChangePercent={setZipPercent} />
      <SerialPortBtn
        onClickGetReader={getReader}
        connectSerialPort={serialPort}
      />
      <Modifier percent={zipPercent} />
      <LedSections
        lux={lux}
        percent={zipPercent}
        onSetPercent={setZipPercent}
      />
    </Layout>
  );
};

export default App;
