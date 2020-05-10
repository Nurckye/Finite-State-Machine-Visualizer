import React, { Component } from "react";
import Canvas from "./Canvas";
import LeftPanel from "./LeftPanel";

const defaultInformation = {
  name: "Hello",
  information:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
};

const PopUp = (props) => {
  if (props.displayPopUp !== null)
    return (
      <div
        className="pop-up"
        style={{ left: props.displayPopUp[0], top: props.displayPopUp[1] + 18 }}
      >
        <h1>{props.popUpInfo.name}</h1>
        <p>{props.popUpInfo.details}</p>
      </div>
    );
  return <div style={{ display: "none" }}></div>;
};

class LayoutController extends Component {
  state = {
    currentNode: null,
    environment: [],
    limits: [],
    sensors: [],
    states: {},
    transitions: [],
    transitionGraph: [],
    nodeDataArray: [],
    linkDataArray: [],
    initial: null,
    displayPopUp: null,
    popUpInfo: { name: "", details: "" },
  };

  componentDidMount() {
    window.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        // console.log(e.pageX);
        // console.log(e.pageY);
        if (
          typeof e.target.className === "string" &&
          e.target.className.includes("transition")
        ) {
          let res = e.target.className.split(" ")[1].split("-");
          let info = this.state.transitionGraph[res[0]][res[1]].information;
          this.setState({ popUpInfo: info, displayPopUp: [e.pageX, e.pageY] });
        } else if (this.state.displayPopUp !== null)
          this.setState({ displayPopUp: null });

        return false;
      },
      false
    );

    document.addEventListener(
      "click",
      (e) => {
        if (e.target.className !== "pop-up")
          this.setState({ displayPopUp: null });
      },
      true
    );
  }

  machineSetter = {
    sensors: (sensors) => this.setState({ sensors }),
    environment: (environment) => this.setState({ environment }),
    states: (states) => this.setState({ states }),
    transitions: (transitions) => this.setState({ transitions }),
    transitionGraph: (transitionGraph) => this.setState({ transitionGraph }),
    initial: (initial) => this.setState({ initial }),
    nodeDataArray: (nodeDataArray) => this.setState({ nodeDataArray }),
    linkDataArray: (linkDataArray) => this.setState({ linkDataArray }),
  };

  render() {
    return (
      <React.Fragment>
        <Canvas
          sensors={this.state.sensors}
          environment={this.state.environment}
          states={this.state.states}
          transitions={this.state.transitions}
          transitionGraph={this.state.transitionGraph}
          initial={this.state.initial}
          setCurrentNodeLayout={(currentNode) => this.setState({ currentNode })}
          linkDataArray={this.state.linkDataArray}
          nodeDataArray={this.state.nodeDataArray}
        />
        <PopUp
          popUpInfo={this.state.popUpInfo}
          displayPopUp={this.state.displayPopUp}
        />
        <LeftPanel
          currentState={
            this.state.currentNode !== null
              ? this.state.states[this.state.currentNode]
              : defaultInformation
          }
          sensors={this.state.sensors}
          environment={this.state.environment}
          machineSetter={this.machineSetter}
        />
      </React.Fragment>
    );
  }
}

export default LayoutController;
