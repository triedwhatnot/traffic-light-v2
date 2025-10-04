import { useEffect, useRef, useState } from "react";
import "./index.css";

export default function App() {
  return (
    <div className="App">
      <TrafficLight />
    </div>
  );
}

const lightMap = {
  red: {
    time: 5,
    nextColor: "yellow",
  },
  yellow: {
    time: 2,
    nextColor: "green",
  },
  green: {
    time: 7,
    nextColor: "red",
  },
};

function TrafficLight() {
  const [activeLight, setActiveLight] = useState("red");
  const [remainingTime, setRemainingTime] = useState(lightMap.red.time);
  const intervalId = useRef();
  const inputRef = useRef();
  const selectRef = useRef();

  useEffect(() => {
    updateLight("red", lightMap.red.time);

    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      clearInterval(intervalId.current);
      let nextColor = lightMap[activeLight].nextColor;
      let nextTime = lightMap[nextColor].time;
      updateLight(nextColor, nextTime);
    }
  }, [remainingTime]);

  const updateLight = (light, time) => {
    clearInterval(intervalId.current);
    setActiveLight(light);
    setRemainingTime(time);

    intervalId.current = setInterval(() => {
      setRemainingTime((remTime) => remTime - 1);
    }, 1000);
  };

  const handleCustomLight = () => {
    const newTime = +inputRef.current.value || 0;
    const newLight = selectRef.current.value;
    if (newLight && newTime > 0) {
      updateLight(newLight, newTime);
    }
  };

  return (
    <>
      <div className="light-parent">
        <span
          className={`light-box red ${activeLight === "red" ? "active" : ""}`}
        ></span>
        <span
          className={`light-box yellow ${
            activeLight === "yellow" ? "active" : ""
          }`}
        ></span>
        <span
          className={`light-box green ${
            activeLight === "green" ? "active" : ""
          }`}
        ></span>
      </div>

      <div>{remainingTime} secs</div>

      <div className="control-parent">
        <div className="control-custom">
          <input ref={inputRef} type={"number"} min={1} />
          <select ref={selectRef} defaultValue={""}>
            <option value={""} disabled>
              Select color
            </option>
            <option value={"red"}>Red</option>
            <option value={"yellow"}>Yellow</option>
            <option value={"green"}>Green</option>
          </select>
          <button onClick={handleCustomLight}>Go</button>
        </div>

        <div className="control-default">
          <button
            onClick={() => {
              updateLight("red", lightMap.red.time);
            }}
          >
            Red
          </button>
          <button
            onClick={() => {
              updateLight("yellow", lightMap.yellow.time);
            }}
          >
            Yellow
          </button>
          <button
            onClick={() => {
              updateLight("green", lightMap.green.time);
            }}
          >
            Green
          </button>
        </div>
      </div>
    </>
  );
}
