import React, { Component, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const ErrorIcon = () => (
  <svg
    width="46"
    height="46"
    viewBox="0 0 46 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M31.2792 37.2599L36.6033 31.9358L27.9517 23.2842L36.6032 14.6327L31.2791 9.30857L22.6276 17.9601L13.9759 9.30841L8.65179 14.6325L17.3035 23.2842L8.65168 31.936L13.9758 37.2601L22.6276 28.6083L31.2792 37.2599Z"
      fill="white"
    />
  </svg>
);

const useStyles = makeStyles({
  root: {
    width: 250,
    color: "#1c1c1c",
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: "#bfbfbf",
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
});

function valuetext(value) {
  return `${value}sdsddsadasasdsadasC`;
}

function RangeSlider(props) {
  const classes = useStyles();
  // const [value, setValue] = React.useState(props.defaultValue);

  const handleChange = (event, newValue) => {
    props.handleChangeValue(newValue);
    // setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {props.label}
      </Typography>
      <Slider
        value={props.value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        min={props.min}
        step={props.step}
        max={props.max}
      />
    </div>
  );
}

function SimpleSlider(props) {
  const classes = useStyles();
  // const [value, setValue] = React.useState(props.defaultValue);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    props.handleChangeValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {props.label}
      </Typography>
      <Slider
        value={props.value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        min={props.min}
        step={props.step}
        max={props.max}
      />
    </div>
  );
}

const test = {
  title: "Livrare pachet",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
};

const DescriptionArea = (props) => {
  return (
    <div className="information-area">
      <h1>{props.currentState.name}</h1>
      <p>{props.currentState.information}</p>
    </div>
  );
};

const TabSelector = (props) => {
  const [selectedTab, setSelectedTab] = useState("Sensors");
  return (
    <div className="tab-options">
      {["Sensors", "Limits", "Internal State"].map((value, ix) => (
        <button
          key={ix}
          style={{ color: value === selectedTab ? "#0F0F0F" : "#B9B9B9" }}
          onClick={() => {
            props.changeTab(value);
            setSelectedTab(value);
          }}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

function ToogleSwitch(props) {
  const [isOpen, changeIsOpen] = useState(props.env.value);
  return (
    <React.Fragment>
      <span>{props.env.label}</span>
      <label className="switch">
        <input
          type="checkbox"
          defaultChecked={props.env.value}
          onChange={() => {
            props.envChangeBool(props.env.key)(!isOpen);
            changeIsOpen(!isOpen);
          }}
        />
        <span className="slider round"></span>
      </label>
    </React.Fragment>
  );
}

class LeftPanel extends Component {
  state = {
    isLoaded: false,
    currentTab: "Sensors",
    errored: false,
    errorMessage: "",
  };

  setErrorMessageLoading(message) {}

  loadMachine() {
    let loadedMachine;
    let seenList;
    let machineJson = document.getElementById("textarea-json").value;
    try {
      loadedMachine = JSON.parse(machineJson);
    } catch {
      throw "Invalid JSON format";
    }

    if (
      !("environment" in loadedMachine) ||
      !("sensors" in loadedMachine) ||
      !("states" in loadedMachine) ||
      !("transitions" in loadedMachine)
    )
      throw `Missing fields for finite state machine`;

    let sensorsSeenList = {};
    let newSensors = {};
    loadedMachine.sensors.forEach((sensor) => {
      if (sensorsSeenList[sensor.key])
        throw `Duplicate key for sensors: ${sensor.key}`;
      if (
        typeof sensor.minValue !== "number" ||
        typeof sensor.maxValue !== "number"
      )
        throw `Minimum and maximum values for sensor ${sensor.key} must be real numbers`;
      if (sensor.minValue >= sensor.maxValue)
        throw `Maximum value for sensor ${sensor.key} must be strictly greater than the minimum value`;
      if (!sensor.limit.label)
        throw `Limit label for sensor ${sensor.key} must be set`;
      if (!sensor.limit.label)
        throw `Limit label for sensor ${sensor.key} must be set`;
      if (
        typeof sensor.limit.min !== "number" ||
        typeof sensor.limit.max !== "number"
      )
        throw `Minimum and maximum limit thresholds for sensor ${sensor.key} must be real numbers`;
      if (sensor.limit.minValue >= sensor.limit.maxValue)
        throw `Maximum limit threshold value for sensor ${sensor.key} must be strictly greater than the minimum value`;
      if (
        sensor.limit.valueType !== "NUMBER" &&
        sensor.limit.valueType !== "RANGE" &&
        sensor.limit.valueType !== "RELATIVE"
      )
        throw `Limit value type of sensor ${sensor.key} must either NUMBER, RANGE or RELATIVE`;

      sensorsSeenList[sensor.key] = true;
      newSensors[sensor.key] = sensor;
    });
    this.props.machineSetter.sensors(newSensors);

    let envSeenList = {};
    let newEnv = {};
    loadedMachine.environment.forEach((env) => {
      if (envSeenList[env.key])
        throw `Duplicate key for internal state: ${env.key}`;
      if (env.type !== "BOOL" && env.type !== "FLOAT")
        throw `Type for internal state ${env.key} must be either BOOL or FLOAT`;
      if (env.type === "BOOL" && typeof env.value !== "boolean")
        throw `Value for internal state ${env.key} must be either true or false`;
      if (env.type === "FLOAT" && typeof env.value !== "number") {
        throw `Value for internal state ${env.key} must be a real number`;
      }

      envSeenList[env.key] = true;
      newEnv[env.key] = env;
    });
    this.props.machineSetter.environment(newEnv);

    let statesSeenList = {};
    let newStates = {};
    loadedMachine.states.forEach((st) => {
      if (statesSeenList[st.key]) throw `Duplicate key for states: ${st.key}`;
      statesSeenList[st.key] = true;
      newStates[st.key] = st;
    });
    this.props.machineSetter.states(newStates);

    let initialStateSet = false;
    loadedMachine.states.forEach((st, ix) => {
      if (st.category === "Initial") {
        if (initialStateSet) throw "Two initial states detected!";
        initialStateSet = true;
        this.props.machineSetter.initial(st.key);
      }
    });

    let nodeArr = Object.values(newStates).map((state, ix) => {
      return {
        key: state.key,
        name: `Q${state.key}`,
        color: "white",
        text: "empty",
        category: state.category,
      };
    });
    this.props.machineSetter.nodeDataArray(nodeArr);

    loadedMachine.transitions.forEach((tr) => {
      if (!tr.label)
        throw `Missing label for transition - node ${tr.from} to node ${tr.to}`;

      if (!(tr.from in statesSeenList) || !(tr.to in statesSeenList))
        throw `Broken link for transition - node ${tr.from} to node ${tr.to}`;
      tr.dependsOn.forEach((dp) => {
        if (!(dp in sensorsSeenList))
          throw `Sensor for key ${dp} was not declared - node ${tr.from} to node ${tr.to}`;
      });
      tr.requires.forEach((rq) => {
        if (!(rq.which in envSeenList))
          throw `Internal state for key ${rq.which} was not declared - node ${tr.from} to node ${tr.to}`;
        if (typeof rq.value !== "boolean")
          throw `Internal state for key ${rq.which} must be either true or false - node ${tr.from} to node ${tr.to}`;
      });
    });
    this.props.machineSetter.transitions(loadedMachine.transitions);
    const transitionGraph = {};
    loadedMachine.states.forEach((state) => (transitionGraph[state.key] = {}));

    loadedMachine.transitions.forEach((transition) => {
      transitionGraph[transition.from][transition.to] = {
        label: transition.label,
        information: transition.information,
        dependsOn: transition.dependsOn,
        requires: transition.requires,
      };
    });
    this.props.machineSetter.transitionGraph(transitionGraph);

    let transitionArr = loadedMachine.transitions.map((transition) => {
      return {
        from: transition.from,
        to: transition.to,
        text: transition.label,
      };
    });
    this.props.machineSetter.linkDataArray(transitionArr);

    console.log(loadedMachine);
    this.setState({ isLoaded: true, errored: false, errorMessage: "" });
  }

  sensorChange = (key) => (e) => {
    let inputValue = e.target.value;
    console.log("Sensor val:", e.target.value);
    let temp_sensors = Object.assign({}, this.props.sensors);
    temp_sensors[key].value = inputValue;
    this.props.machineSetter.sensors(temp_sensors);
  };

  envChange = (key) => (e) => {
    let inputValue = e.target.value;
    console.log("Env val:", e.target.value);
    let temp_environment = Object.assign({}, this.props.environment);
    temp_environment[key].value = inputValue;
    this.props.machineSetter.environment(temp_environment);
  };

  envChangeBool = (key) => (value) => {
    console.log("Env val:", value);
    let temp_environment = Object.assign({}, this.props.environment);
    temp_environment[key].value = value;
    this.props.machineSetter.environment(temp_environment);
  };

  limitsChange = (key) => (value) => {
    console.log("VAL E", value);
    let temp_sensors = Object.assign({}, this.props.sensors);
    temp_sensors[key].limit.value = value;
    this.props.machineSetter.sensors(temp_sensors);
  };

  renderBottomView = () => {
    switch (this.state.currentTab) {
      case "Sensors":
        return (
          <div className="sensors">
            {Object.values(this.props.sensors).map((sensor, ix) => (
              <div className="value-input" key={`sens${ix}`}>
                <label className="input-label" htmlFor={sensor.name}>
                  {sensor.name}
                </label>
                <input
                  type="text"
                  name=""
                  id={sensor.name}
                  value={sensor.value}
                  onInput={this.sensorChange(sensor.key)}
                />
              </div>
            ))}
          </div>
        );

      case "Limits":
        return Object.values(this.props.sensors).map((sensor, ix) => (
          <div key={`lim${ix}`} className="slide-box">
            {sensor.limit.valueType === "RANGE" ? (
              <RangeSlider
                value={sensor.limit.value}
                label={sensor.limit.label}
                min={sensor.limit.min}
                max={sensor.limit.max}
                step={sensor.limit.step}
                handleChangeValue={this.limitsChange(sensor.key)}
              />
            ) : (
              <SimpleSlider
                value={sensor.limit.value}
                label={sensor.limit.label}
                min={sensor.limit.min}
                max={sensor.limit.max}
                step={sensor.limit.step}
                handleChangeValue={this.limitsChange(sensor.key)}
              />
            )}
          </div>
        ));

      case "Internal State":
        return (
          <div className="internal-state">
            {Object.values(this.props.environment).map((env, ix) => {
              if (env.type === "FLOAT")
                return (
                  <div className="value-input" key={`is${ix}`}>
                    <label className="input-label" htmlFor={env.label}>
                      {env.label}
                    </label>
                    <input
                      type="text"
                      name=""
                      id={env.label}
                      value={env.value}
                      onInput={this.envChange(env.key)}
                    />
                  </div>
                );
              else if (env.type === "BOOL")
                return (
                  <div className="value-input">
                    <ToogleSwitch
                      env={env}
                      envChangeBool={this.envChangeBool}
                    />
                  </div>
                );
            })}
          </div>
        );
    }
  };

  renderLoader() {
    if (!this.state.isLoaded)
      return (
        <div className="json-input">
          <textarea id="textarea-json" cols="39"></textarea>
          <button
            onClick={() => {
              try {
                this.loadMachine();
              } catch (err) {
                this.setState(
                  {
                    errored: true,
                    errorMessage: err,
                  },
                  () => this.props.machineSetter.resetToInitial()
                );
              }
            }}
          >
            Load machine
          </button>
        </div>
      );
    else
      return (
        <React.Fragment>
          <TabSelector
            changeTab={(tab) => this.setState({ currentTab: tab })}
          />
          {this.renderBottomView()}
        </React.Fragment>
      );
  }

  render() {
    return (
      <React.Fragment>
        <div className="left-panel">
          <DescriptionArea currentState={this.props.currentState} />
          <div className="separator-bar" />
          {this.renderLoader()}
        </div>
        <div
          className="error-container"
          style={{ display: this.state.errored ? "flex" : "none" }}
        >
          <div className="error-message">{this.state.errorMessage}</div>
          <div className="error-bubble">
            <ErrorIcon />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LeftPanel;
