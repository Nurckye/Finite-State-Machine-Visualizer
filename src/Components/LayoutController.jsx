import React, {
  Component,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Canvas from "./Canvas";
import LeftPanel from "./LeftPanel";

const defaultInformation = {
  name: "Simulator pentru automat finit determinist",
  information:
    "Acesta este simulatorul creat de Nitescu Radu, Tae Andreea, Stefan Andreea, Pinzariu Denis si Chelu Madalina pentru drona de livrat pachete. Incarcati codul atasat automatului pentru a-l reprezenta intr-o forma vizuala.",
};

function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);

    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}

function ProjectInfoPopUp(props) {
  const [isOpen, changeOpen] = useState(false);
  const handler = useCallback((e) => {
    if (
      typeof e.target.className === "string" &&
      e.target.className !== "pr-info"
    )
      changeOpen(false);
  }, []);
  useEventListener("click", handler);

  const InfoIcon = () => (
    <svg
      width="8"
      height="32"
      viewBox="0 0 8 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 28V14.2222C0 12.0131 1.79086 10.2222 4 10.2222C6.20914 10.2222 8 12.0131 8 14.2222V20.8889V28C8 30.2091 6.20914 32 4 32C1.79086 32 0 30.2091 0 28Z"
        fill="white"
      />
      <path
        d="M8 4V4.44444C8 6.65358 6.20914 8.44445 4 8.44445C1.79086 8.44445 0 6.65358 0 4.44444V4C0 1.79086 1.79086 0 4 0C6.20914 0 8 1.79086 8 4Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div
      className="info-container pr-info"
      style={{
        display: Object.values(props.states).length !== 0 ? "flex" : "none",
      }}
    >
      <table
        className="pr-info"
        style={{
          display: isOpen ? "flex" : "none",
        }}
      >
        {Object.values(props.states).map((element) => (
          <tr className="pr-info">
            <th className="pr-info">{`Q${element.key}`}</th>
            <th className="pr-info">{element.name}</th>
          </tr>
        ))}
      </table>
      <button className="pr-info" onClick={() => changeOpen(!isOpen)}>
        <InfoIcon />
      </button>
    </div>
  );
}

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
    resetToInitial: () => {
      this.setState({
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
      });
    },
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
        <ProjectInfoPopUp states={this.state.states} />
      </React.Fragment>
    );
  }
}

export default LayoutController;
