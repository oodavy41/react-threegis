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
