import React from "react";
import ReactDOM from "react-dom";
import Geomentry from "./Geomentry";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Geomentry />, div);
  ReactDOM.unmountComponentAtNode(div);
});
