import * as React from "react";
import { loadModules } from "react-arcgis";
import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";
import TScene from "./threeScene";
OBJLoader(THREE);

export default class Geomentry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
    this.TScene = null;
  }

  render() {
    return null;
  }

  componentWillMount() {
    loadModules(
      [
        "esri/geometry/SpatialReference",
        // "esri/geometry/Point",
        // "esri/geometry/Mesh",
        // "esri/Graphic",
        "esri/views/3d/externalRenderers"
      ],
      { url: null }
    ).then(([SpatialReference, externalRenderers]) => {
      this.TScene = new TScene(
        this.props.view,
        externalRenderers,
        SpatialReference,
        [
          this.props.position.originX,
          this.props.position.originY
        ],
        this.props.position.size
      );
      this.TScene.setMousePos(
        this.props.mousePos,
        this.props.presentPos
      );
      this.TScene.updateFPS = this.props.updateFPS;
      externalRenderers.add(this.props.view, this.TScene);
    });
  }

  makeGraphic(
    Point,
    Mesh,
    Graphic,
    sx,
    sy,
    sz,
    dx,
    dy,
    z,
    color
  ) {
    var locate = this.props.extent.center;
    locate = locate.clone();
    locate.z = z;
    locate.x += dx;
    locate.y += dy;

    var mesh = Mesh.createBox(locate, {
      size: {
        width: sx,
        height: sz,
        depth: sy
      },
      material: {
        color: color
      }
    });

    return new Graphic({
      geometry: mesh,
      symbol: {
        type: "mesh-3d",
        symbolLayers: [{ type: "fill" }]
      }
    });
  }

  componentWillUnmount() {
    this.props.view.graphics.remove(this.g);
  }
}
