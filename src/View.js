import React from "react";
import { Scene } from "react-arcgis";
import { Map } from "react-arcgis";
import Geomentry from "./Geomentry";
import { loadModules } from "react-arcgis";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      clippingArea: null,
      graphic: null
    };
  }
  componentWillMount() {
    var x = 13523831;
    var y = 3655570;
    var dis = 5000;
    loadModules([
      "esri/geometry/Extent",
      "esri/geometry/SpatialReference"
    ])
      .then(([Extent, SpatialReference]) => {
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
          }
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
            basemap: "streets-navigation-vector",
            ground: "world-topobathymetry"
          }}
          viewProperties={{
            clippingArea: this.state.clippingArea,
            viewingMode: "local",
            camera: this.state.camera
          }}
        >
          <Geomentry extent={this.state.clippingArea} />
        </Scene>
      );
    } else {
      return null;
    }
  }
}
