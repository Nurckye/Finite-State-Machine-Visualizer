import React, { Component } from "react";
import * as go from "gojs";
import TopBar from "./TopBar";
import { ReactDiagram } from "gojs-react";

function initDiagram() {
  go.Shape.defineFigureGenerator("Ring", function (shape, w, h) {
    var param1 = shape ? shape.parameter1 : NaN;
    if (isNaN(param1) || param1 < 0) param1 = 8;

    var rad = w / 2;
    var geo = new go.Geometry();
    var fig = new go.PathFigure(w, w / 2, true); // clockwise
    geo.add(fig);
    fig.add(
      new go.PathSegment(go.PathSegment.Arc, 0, 360, rad, rad, rad, rad).close()
    );

    fig.add(
      new go.PathSegment(
        go.PathSegment.Arc,
        0,
        360,
        rad,
        rad,
        rad - 4,
        rad - 4
      ).close()
    );

    geo.spot1 = new go.Spot(0.156, 0.156);
    geo.spot2 = new go.Spot(0.844, 0.844);
    geo.defaultStretch = go.GraphObject.Uniform;
    return geo;
  });

  const $ = go.GraphObject.make;

  const diagram = $(go.Diagram, {
    "undoManager.isEnabled": true, // must be set to allow for model change listening
    // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
    "clickCreatingTool.archetypeNodeData": {
      text: "new node",
      color: "lightblue",
    },
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
    }),
  });

  // define a simple Node template
  diagram.nodeTemplate = $(
    go.Node,
    "Auto",
    $(
      go.Shape,
      "Circle",
      // Shape.fill is bound to Node.data.color
      new go.Binding("fill", "color")
    ),
    $(
      go.TextBlock,
      { margin: 4, stroke: "black" }, // some room around the text
      new go.Binding("text", "name")
    )
  );

  diagram.nodeTemplateMap.add(
    "Final",
    $(
      go.Node,
      "Auto",
      $(go.Shape, "Ring", new go.Binding("fill", "color")),
      $(
        go.TextBlock,
        { margin: 4, stroke: "black" }, // some room around the text
        new go.Binding("text", "name")
      )
    )
  );
  diagram.linkTemplate = $(
    go.Link,
    {
      curve: go.Link.Bezier,
      curviness: 50,
      adjusting: go.Link.Stretch,
      reshapable: true,
      relinkableFrom: true,
      relinkableTo: true,
      toShortLength: 3,
    }, // Bezier curve
    $(go.Shape),
    $(go.Shape, { toArrow: "Standard" }),
    // $(go.TextBlock, "left", { alignmentFocus: new go.Spot(1, 0.5, 3, 0) }, new go.Binding("text").makeTwoWay())
    $(
      go.Panel,
      "Auto",
      $(
        go.Shape, // the label background, which becomes transparent around the edges
        {
          fill: $(go.Brush, "Radial", {
            0: "rgb(245, 245, 245)",
            0.7: "rgb(245, 245, 245)",
            1: "rgba(245, 245, 245, 0)",
          }),
          stroke: null,
        }
      ),
      $(
        go.TextBlock,
        "transition",
        {
          textAlign: "center",
          font: "9pt helvetica, arial, sans-serif",
          margin: 4,
        },
        new go.Binding("text").makeTwoWay()
      )
    )
  );

  return diagram;
}

class Canvas extends Component {
  state = {
    currentNode: null,
    states: [],
    transitions: [],
    transitionGraph: [],
    initial: null,
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     this.props.states !== nextProps.states ||
  //     this.props.transitions !== nextProps.transitions ||
  //     this.props.transitionGraph !== nextProps.transitionGraph ||
  //     this.props.initial !== nextProps.initial ||
  //     this.props.sensors !== nextProps.sensors ||
  //     this.props.environment !== nextProps.environment ||
  //     this.state.currentNode !== nextState.currentNode
  //   )
  //     return true;
  //   return false;
  // }

  constructor(props) {
    super(props);
    this.diagramRef = React.createRef();
  }

  stepInGraph = (nextNode) => {
    let markedColor = "#3f4c1c";
    let unmarkedColor = "white";
    this.setState({ currentNode: nextNode }, () => {
      const diagram = this.diagramRef.current.getDiagram();
      diagram.model.commit((m) => {
        let data = null;
        for (let nd of m.nodeDataArray) {
          m.set(nd, "color", unmarkedColor);
          if (nd.key == nextNode) {
            data = nd;
          }
        }
        m.set(data, "color", markedColor);
      }, "increment");
      this.props.setCurrentNodeLayout(nextNode);
    });
  };

  render() {
    return (
      <div>
        <ReactDiagram
          initDiagram={initDiagram}
          divClassName="diagram-component"
          ref={this.diagramRef}
          nodeDataArray={this.props.nodeDataArray}
          linkDataArray={this.props.linkDataArray}
          onModelChange={() => {}}
        />

        <TopBar
          initial={this.props.initial}
          stepInGraph={this.stepInGraph}
          incrementData={this.incrementData}
          sensors={this.props.sensors}
          environment={this.props.environment}
          currentNode={this.state.currentNode}
          transitions={
            this.state.currentNode !== null
              ? this.props.transitionGraph[this.state.currentNode]
              : {}
          }
        />
      </div>
    );
  }
}

export default Canvas;
