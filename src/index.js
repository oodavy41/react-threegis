import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Geomentry from "./Geomentry";
import { loadMap } from "react-amap-next/lib/api";
import * as PL from "react-amap-next/lib/Polyline";
import Map from "react-amap-next/lib/Map";
import Marker from "react-amap-next/lib/Marker";
import { Path, Color } from "three";

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      AMap: null,
      defaultOptions: {
        viewMode: "3D",
        mapStyle:
          "amap://styles/c9713c71e62e9da6e941d73fc568b766",
        resizeEnable: true,
        rotateEnable: false,
        zoomEnable: false,
        doubleClickZoom: false,
        expandZoomRange: false,
        showIndoorMap: false,
        zoom: 17,
        pitch: 45,
        maxPitch: 45,
        rotation: 0,
        buildingAnimation: true
      }
    };
    this.Map = null;
    let options = this.props.options;
    for (const key in options) {
      if (this.state.defaultOptions[key]) {
        this.state.defaultOptions[key] = options[key];
      }
    }
  }
  componentDidUpdate() {}
  componentWillMount() {}

  componentDidMount() {
    loadMap("67b4b19e0b19792352244afd39397457").then(AMap => {
      this.setState({ AMap: AMap, ready: true });

      let object3Dlayer = new AMap.Object3DLayer();
      this.Map.add(object3Dlayer);
      let boards = [
        new AMap.LngLat(121.474108, 31.231262),
        new AMap.LngLat(121.472563, 31.230281),
        new AMap.LngLat(121.473234, 31.2294),
        new AMap.LngLat(121.474795, 31.230487),
        new AMap.LngLat(121.474108, 31.231262)
      ];
      let line = new AMap.Object3D.MeshLine({
        Path: boards,
        width: 10,
        height: 5,
        color: "rgba(55,129,240, 0.9)"
      });
      line.transparent = true;
      object3Dlayer.add(line);
    });
  }

  render() {
    if (this.state.ready) {
      return (
        <Map
          refer={mine => {
            this.Map = mine;
          }}
          AMap={this.state.AMap}
          style={{ width: "600px", height: "600px" }}
          options={this.state.defaultOptions}
          events={{}}
        />
      );
    } else {
      return null;
    }
  }
}

ReactDOM.render(<View />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
