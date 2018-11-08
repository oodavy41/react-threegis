import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Scene } from "react-arcgis";
import { Map } from "react-arcgis";
import Geomentry from "./Geomentry";
import { loadModules } from "react-arcgis";

export let localUrl =
  // "http://10.10.15.6:8080/arcgis_js_api/library/4.9/";
  null;
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      clippingArea: null,
      graphic: null,
      originX: 13523831,
      originY: 3655570,
      size: 5000,
      FPS: 0
    };
    this.fraps = { time: 0, count: 0 };
    this.ref = null;
    this.mousePos = { x: 0, y: 0 };
    this.mouseInfos = {
      start: null,
      end: null,
      readState: false,
      chooseState: false
    };
  }
  componentWillMount() {
    var x = this.state.originX;
    var y = this.state.originY;
    var dis = this.state.size;
    loadModules(
      [
        "esri/geometry/Extent",
        "esri/geometry/SpatialReference",
        "esri/layers/VectorTileLayer"
      ],
      { url: localUrl }
    )
      .then(([Extent, SpatialReference, VectorTileLayer]) => {
        this.setState({
          ready: true,
          clippingArea: new Extent({
            xmax: x + dis,
            xmin: x,
            ymax: y + dis,
            ymin: y,
            spatialReference: SpatialReference.WebMercator
          }),
          camera: {
            position: {
              spatialReference: SpatialReference.WebMercator,
              x: x + 0.5 * dis,
              y: y - 1.2 * dis,
              z: 4000
            },
            heading: 0, // direction -z
            tilt: 60 // -z:0 - z:180
          },
          layers: [
            new VectorTileLayer({
              url:
                "https://jsapi.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/root.json"
            })
          ]
        });
        console.log("READEYYYY");
      })
      .catch(err => console.error(err));
  }

  onMouseMove = event => {
    if (!this.ref) return;
    this.mousePos.x = event.x / this.ref.clientWidth;
    this.mousePos.y = event.y / this.ref.clientHeight;
  };

  componentDidUpdate() {
    if (!this.ref) {
      this.ref = ReactDOM.findDOMNode(this);
    }
  }

  onClick = event => {
    if (!this.ref) return;
    console.log(
      "index.choosestate",
      this.mouseInfos.chooseState
    );
    if (!this.mouseInfos.chooseState) {
      this.mouseInfos.start = [
        event.screenPoint.x / this.ref.clientWidth,
        event.screenPoint.y / this.ref.clientHeight
      ];
    } else {
      this.mouseInfos.end = [
        event.screenPoint.x / this.ref.clientWidth,
        event.screenPoint.y / this.ref.clientHeight
      ];
      this.mouseInfos.readState = true;
    }
    this.mouseInfos.chooseState = !this.mouseInfos.chooseState;
  };
  computeFPS = (delta => {
    if (!this.fraps) return;
    this.fraps.time += delta;
    this.fraps.count++;
    if (this.fraps.count >= 10) {
      this.setState({ FPS: 10 / this.fraps.time });
      this.fraps.count = this.fraps.time = 0;
    }
  }).bind(this);

  render() {
    if (this.state.ready) {
      return (
        <Scene
          loaderOptions={{
            url: localUrl
          }}
          style={{ width: "1000px", height: "1000px" }}
          mapProperties={{
            //basemap: "streets-night-vector",
            ground: "world-topobathymetry",
            layers: this.state.layers
          }}
          viewProperties={{
            clippingArea: this.state.clippingArea,
            viewingMode: "local",
            camera: this.state.camera,
            alphaCompositingEnabled: true,
            environment: {
              background: {
                type: "color",
                color: [155, 152, 144, 0]
              },
              starsEnabled: false,
              atmosphereEnabled: false
            }
          }}
          onPointerMove={this.onMouseMove}
          onClick={this.onClick}
        >
          <div
            style={{
              position: "absolute",
              background: "rgba(0,0,0,0.2)",
              left: 0,
              top: 0
            }}
          >
            FPS:{"" + this.state.FPS}
          </div>
          <Geomentry
            updateFPS={this.computeFPS}
            mousePos={this.mouseInfos}
            presentPos={this.mousePos}
            extent={this.state.clippingArea}
            position={{
              originX: this.state.originX,
              originY: this.state.originY,
              size: this.state.size
            }}
          />
        </Scene>
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
