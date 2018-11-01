import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Scene } from "react-arcgis";
import { Map } from "react-arcgis";
import Geomentry from "./Geomentry";
import { loadModules } from "react-arcgis";

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      clippingArea: null,
      graphic: null,
      originX: 13523831,
      originY: 3655570,
      size: 5000
    };
  }
  componentWillMount() {
    var x = this.state.originX;
    var y = this.state.originY;
    var dis = this.state.size;
    loadModules([
      "esri/geometry/Extent",
      "esri/geometry/SpatialReference",
      "esri/layers/VectorTileLayer"
    ])
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

  render() {
    if (this.state.ready) {
      return (
        <Scene
          style={{ width: "100vw", height: "100vh" }}
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
        >
          <Geomentry
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
