import React, { Component, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

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
  };

  setErrorMessageLoading(message) {}

  loadMachine() {
    let loadedMachine;
    let machineJson = document.getElementById("textarea-json").value;
    try {
      loadedMachine = JSON.parse(machineJson);
    } catch {
      this.setErrorMessageLoading("Invalid JSON format");
      return;
    }

    let newSensors = {};
    loadedMachine.sensors.forEach(
      (sensor) => (newSensors[sensor.key] = sensor)
    );
    this.props.machineSetter.sensors(newSensors);

    let newEnv = {};
    loadedMachine.environment.forEach((env) => (newEnv[env.key] = env));
    this.props.machineSetter.environment(newEnv);

    let newStates = {};
    loadedMachine.states.forEach((st) => (newStates[st.key] = st));
    this.props.machineSetter.states(newStates);

    loadedMachine.states.forEach((st, ix) => {
      if (st.category === "Initial") this.props.machineSetter.initial(st.key);
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
    this.setState({ isLoaded: true });
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
          <button onClick={() => this.loadMachine()}>Load machine</button>
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
      <div className="left-panel">
        <DescriptionArea currentState={this.props.currentState} />
        <hr />
        {this.renderLoader()}
      </div>
    );
  }
}

export default LeftPanel;
