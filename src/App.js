import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [reciveTextStm32, setReciveTextStm32] = useState("Recive text");
  const [serialPort, setSerialPort] = useState(null);

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
    const encoder = new TextEncoder();
    const writer = serialPort.writable.getWriter();
    await writer.write(encoder.encode(value));
    writer.releaseLock();
  }

  const streamHandler = (value) => {
    serialPort ? writeToStream(value) : setReciveTextStm32("Click Start !!!");
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className="Start" onClick={getReader}>
          Start
        </button>
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
      </header>
    </div>
  );
};

export default App;
