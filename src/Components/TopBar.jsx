import React, { Component, useState } from "react";

const PlayIcon = () => (
  <svg
    width="36"
    height="32"
    viewBox="0 0 36 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M36 21L0 41.7846V0.215391L36 21Z" fill="#202020" />
  </svg>
);

const ReloadToInitialIcon = () => (
  <svg
    width="36"
    height="30"
    viewBox="0 0 36 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.3043 15C31.3043 11.7572 30.2077 8.60165 28.1789 6.00635C26.15 3.41105 23.2981 1.51574 20.0507 0.60445C16.8032 -0.306837 13.335 -0.185021 10.1659 0.951642C6.9967 2.08831 4.29727 4.1786 2.47209 6.90927C0.646908 9.63994 -0.205714 12.8639 0.0419945 16.0981C0.289703 19.3322 1.6244 22.4023 3.84607 24.8483C6.06774 27.2943 9.05673 28.9845 12.3651 29.6655C15.6735 30.3465 19.123 29.9817 22.1969 28.6258L15.6522 15H31.3043Z"
      fill="#202020"
    />
    <ellipse cx="15.6522" cy="15" rx="10.9565" ry="10.5" fill="white" />
    <path
      d="M29.3479 22.5L22.6957 15L29.3478 15L36 15L29.3479 22.5Z"
      fill="#202020"
    />
  </svg>
);

const isInLimits = (sensor, environment) => {
  if (Array.isArray(sensor.limit.value))
    return (
      sensor.limit.value[0] < sensor.value &&
      sensor.value < sensor.limit.value[1]
    );
  else if (sensor.limit.valueType === "RELATIVE")
    return (
      sensor.limit.value >
      Math.abs(sensor.value - environment[sensor.limit.relativeToEnviron].value)
    );
  return sensor.value < sensor.limit.value;
};

const meetsRequirements = (transition, environment) => {
  let foundOne = false;
  transition.requires.forEach((rq) => {
    console.log(environment[rq.which].value, rq.value);
    if (environment[rq.which].value !== rq.value) {
      foundOne = true;
    }
  });

  if (foundOne) return false;
  return true;
};

function TopBar(props) {
  let [started, changeStarted] = useState(false);
  const canTransitionHappen = (transition) => {
    for (let dep of transition.dependsOn)
      if (!isInLimits(props.sensors[dep], props.environment)) return false;
    if (!meetsRequirements(transition, props.environment)) return false;
    return true;
  };
  return (
    <React.Fragment>
      <div className="top-bar">
        {Object.entries(props.transitions).map(([k, v], ix) => (
          <span>
            <button
              className={`transition ${props.currentNode}-${k}`}
              key={`tr-top${ix}`}
              onClick={() => props.stepInGraph(k)}
              style={{
                backgroundColor: canTransitionHappen(v)
                  ? "#9B9B9B"
                  : "rgb(217,83,79)",
              }}
            >
              {v.label}
            </button>
          </span>
        ))}
      </div>
      <button
        className="start-button"
        onClick={() => {
          props.stepInGraph(started ? null : props.initial);
          changeStarted(!started);
        }}
      >
        {started ? <ReloadToInitialIcon /> : <PlayIcon />}
      </button>
    </React.Fragment>
  );
}

export default TopBar;
