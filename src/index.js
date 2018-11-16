import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Geomentry from "./Geometry";
import { loadMap } from "react-amap-next/lib/api";
import * as PL from "react-amap-next/lib/Polyline";
import Map from "react-amap-next/lib/Map";
import Marker from "react-amap-next/lib/Marker";
import { Path, Color } from "three";
import AMapScene from "./AMapScene";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            AMap: null,
            // options
            viewMode: "3D",
            mapStyle: "amap://styles/c9713c71e62e9da6e941d73fc568b766",
            center: [121.459898, 31.308498],
            resizeEnable: true,
            rotateEnable: false,
            zoomEnable: true,
            doubleClickZoom: false,
            expandZoomRange: false,
            showIndoorMap: false,
            zooms: [16, 17],
            pitch: 60,
            maxPitch: 180,
            rotation: 100,
            buildingAnimation: true
        };
        this.Map = null;
        if (this.props.options) {
            this.setState(this.props.options);
        }
    }
    componentDidUpdate() {}
    componentWillMount() {}

    componentDidMount() {
        loadMap("67b4b19e0b19792352244afd39397457").then(AMap => {
            this.setState({ AMap: AMap, ready: true });

            let scene = new AMapScene(AMap, this.Map);

            scene.RUN();
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
                    options={this.state}
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
