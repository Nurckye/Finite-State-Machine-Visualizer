import React, { Component, useState } from "react";

const test = {
  title: "Livrare pachet",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
};

const DescriptionArea = (props) => {
  return (
    <div className="information-area">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
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
            console.log(value);
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

class LeftPanel extends Component {
  state = {
    currentTab: "Sensors",
    sensors: [
      {
        name: "Water",
      },
      {
        name: "Air",
      },
      {
        name: "Water",
      },
      {
        name: "Air",
      },
      {
        name: "Water",
      },
      {
        name: "Air",
      },
      {
        name: "Water",
      },
      {
        name: "Air",
      },
    ],
  };

  renderBottomView = () => {
    switch (this.state.currentTab) {
      case "Sensors":
        return (
          <div className="sensors">
            {this.state.sensors.map((sensor, ix) => (
              <div className="value-input" key={ix}>
                <label htmlFor={sensor.name}>{sensor.name}</label>
                <input type="text" name="gender" id={sensor.name} />
              </div>
            ))}
          </div>
        );
    }
  };

  render() {
    return (
      <div className="left-panel">
        <DescriptionArea title={test.title} content={test.content} />
        <hr />
        <TabSelector changeTab={(tab) => this.setState({ currentTab: tab })} />
        {this.renderBottomView()}
      </div>
    );
  }
}

export default LeftPanel;
