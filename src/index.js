import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Geomentry from "./Geometry";
import { loadMap } from "react-amap-next/lib/api";
import * as PL from "react-amap-next/lib/Polyline";
import Map from "react-amap-next/lib/Map";
import Marker from "react-amap-next/lib/Marker";
import { Path, Color, Texture } from "three";
import AMapScene from "./AMapScene";
import baseMapCamera from "./camera";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            ready: false,
            AMap: null,
            // options
            viewMode: "3D",
            mapStyle: "amap://styles/c9713c71e62e9da6e941d73fc568b766",
            center: [121.459898, 31.308498],
            resizeEnable: true,
            rotateEnable: true,
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
        // target,
        // duration,
        // autoplay = true
        // wait = 0,
        // loop = false,
        // easing = "linear",
        // direction = "alternate",
        // autoplay = true
        loadMap("67b4b19e0b19792352244afd39397457").then(AMap => {
            this.setState({ AMap: AMap, ready: true });
            let scene = new AMapScene(AMap, this.Map);

            //CAMERA TRAIL JSON
            let cam = new baseMapCamera(
                this.state.center,
                this.state.pitch,
                this.state.rotation,
                17
            );
            cam.setTrail(
                [
                    {
                        aim: [121.459938, 31.308468],
                        pitch: 120,
                        rotate: 180,
                        zoom: 16,
                        wait: 5000,
                        duration: 10000
                    },
                    {
                        aim: [121.459878, 31.308408],
                        rotate: 360,
                        zoom: 16,
                        duration: 5000
                    }
                ],
                status => {
                    this.Map.setZoomAndCenter(status.zoom, [status.x, status.y]);
                    this.Map.setRotation(status.rotate);
                    this.Map.setPitch(status.pitch);
                }
            );

            // OBJ JSON DATA GENERATE
            let data = [];
            for (let i = 0; i < 30; i++) {
                let pos = [
                    121.459898 + (Math.random() * 2 - 1) * 0.004,
                    31.308498 + (Math.random() * 2 - 1) * 0.004
                ];
                data.push({
                    type: "dot",
                    height: 1,
                    radius: 100,
                    color: [0.427, 0.322, 0.016, 0.8],
                    position: pos,
                    scaleAnime: {
                        array: [
                            {
                                target: [1.3, 1.3, 1],
                                wait: 500,
                                duration: 500 + Math.random() * 500,
                                loop: true
                            }
                        ]
                    }
                });
            }
            for (let i = 0; i < 15; i++) {
                let pos = [
                    121.459898 + (Math.random() * 2 - 1) * 0.004,
                    31.308498 + (Math.random() * 2 - 1) * 0.004
                ];
                let h = 700 + 700 * Math.random();
                data.push({
                    type: "prism",
                    position: pos,
                    height: h,
                    radius: 120,
                    segment: 4,
                    colorFun: (x, y, z) => {
                        let c1 = [0.094, 0.271, 0.384, 0.8];
                        let c2 = [0.451, 0.588, 0.678, 0.8];
                        return z < -700 ? c2 : c1;
                    },
                    scaleAnime: {
                        start: [1, 1, 0.01],
                        array: [
                            {
                                target: [1, 1, 1],
                                duration: 5000,
                                wait: 5000,
                                easing: "easeOutCubic",
                                direction: "normal"
                            },
                            {
                                target: [2, 2, 1],
                                duration: 5000,
                                direction: "normal"
                            }
                        ]
                    },
                    name: `test${i}`
                });
            }
            data.push({
                type: "border",
                points: [
                    [121.463503, 31.306114],
                    [121.463782, 31.304666],
                    [121.455328, 31.303346],
                    [121.455199, 31.313502],
                    [121.455864, 31.316766],
                    [121.4558, 31.320679],
                    [121.457098, 31.320954],
                    [121.465316, 31.321422],
                    [121.465016, 31.319094],
                    [121.468202, 31.319433],
                    [121.468363, 31.316903],
                    [121.467709, 31.306435]
                ],
                height: 10,
                width: 100,
                color: [0.333, 0.345, 0.608, 1]
            });

            // OBJ JSON END

            scene.data = data;
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
                    style={{ width: "800px", height: "450px" }}
                    options={this.state}
                    events={{}}
                />
            );
        } else {
            return null;
        }
    }
}

ReactDOM.render(
    <View style={{ width: "100%", height: "100%" }} />,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
