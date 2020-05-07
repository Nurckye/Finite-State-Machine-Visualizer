import React, { Component, useState } from "react";

function TopBar(props) {
  // const []
  return (
    <div className="top-bar">
      {props.transitions.map((transition) => (
        <button className="transition">{transition.label}</button>
      ))}
    </div>
  );
}

export default TopBar;
