import { useCallback, useEffect, useRef, useState } from "react";
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
  const [activeLight, setActiveLight] = useState();
  const [remainingTime, setRemainingTime] = useState();
  const intervalId = useRef();
  const inputRef = useRef();
  const selectRef = useRef();
  const timerId = useRef();
  const showNextColor = useRef(false);
  const untilTimestamp = useRef();

  useEffect(() => {
    showNextColor.current = true;

    return () => {
      clearInterval(intervalId.current);
      clearTimeout(timerId.current);
    };
  }, []);

  useEffect(() => {
    if (showNextColor.current === true) {
      let nextColor = lightMap?.[activeLight]?.nextColor || "red";
      let nextTime = lightMap?.[nextColor]?.time || lightMap.red.time;
      updateLight(nextColor, nextTime);
      showNextColor.current = false;
    }
  }, [showNextColor.current]);

  const updateLight = useCallback((light, time) => {
    clearInterval(intervalId.current);
    clearTimeout(timerId.current);
    setActiveLight(light);
    setRemainingTime(time);
    untilTimestamp.current = Date.now() + (time * 1000);

    // interval only for UI changes
    intervalId.current = setInterval(() => {
      let secsElapsed = Math.ceil((untilTimestamp.current - Date.now()) / 1000);
      setRemainingTime(secsElapsed);
    }, 1000);

    // set another timer too here
    timerId.current = setTimeout(() => {
      showNextColor.current = true;
    }, time * 1000);
  }, []);

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
