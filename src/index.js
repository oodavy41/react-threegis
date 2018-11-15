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
import { makeLine, makePanel, makePrism } from "./GLMesh";

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
        this.options = {
            viewMode: this.state.viewMode,
            mapStyle: this.state.mapStyle,
            center: this.state.center,
            resizeEnable: this.state.resizeEnable,
            rotateEnable: this.state.rotateEnable,
            zoomEnable: this.state.zoomEnable,
            doubleClickZoom: this.state.doubleClickZoom,
            expandZoomRange: this.state.expandZoomRange,
            showIndoorMap: this.state.showIndoorMap,
            zooms: this.state.zooms,
            pitch: this.state.pitch,
            maxPitch: this.state.maxPitch,
            rotation: this.state.rotation,
            buildingAnimation: this.state.buildingAnimation
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
            let map = this.Map;
            let tranO = pos => {
                return map.lngLatToGeodeticCoord(pos);
            };
            console.log("map loaded at ", map.getCenter(), tranO(map.getCenter()));

            let object3Dlayer = new AMap.Object3DLayer();
            map.add(object3Dlayer);

            let panel = new AMap.Object3D.Mesh();
            let geo = panel.geometry;
            let p1points = [
                [121.456256, 31.310258],
                [121.458214, 31.31122],
                [121.459351, 31.309905],
                [121.45713, 31.308851]
            ];
            let squarePos = -1500;
            p1points = p1points.map(ele => {
                let ce = tranO(ele);
                return [ce.x, ce.y, squarePos];
            });
            let patt = makePanel(p1points, [0, 0, 0, 1]);

            geo.vertices.push(...patt.vertices);
            geo.faces.push(...patt.faces);
            geo.vertexColors.push(...patt.colors);
            panel.backOrFront = "both";
            object3Dlayer.add(panel);

            let panel2 = new AMap.Object3D.Mesh();
            let geo2 = panel2.geometry;
            let { x, y } = tranO(map.getCenter());
            let d = 1000;
            let points2 = [
                [x - d, y - d],
                [x - d, y + d],
                [x + d, y + d],
                [x + d, y - d]
            ];
            let p2att = makePanel(
                points2.map(e => {
                    return [e[0], e[1], squarePos];
                }),
                [0, 1, 1, 1]
            );

            geo2.vertices.push(...p2att.vertices);
            geo2.faces.push(...p2att.faces);
            geo2.vertexColors.push(...p2att.colors);
            console.log(geo2);

            panel2.backOrFront = "both";
            object3Dlayer.add(panel2);

            let points = [
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
            ];
            let height = 100;
            let width = 100;
            let color = [1, 0.6, 0.6, 1];
            points = points.map(e => {
                let re = tranO(e);
                return [re.x, re.y, -height];
            });
            let boards = points.map((point, index, array) => {
                let start = point;
                let end = array[(index + 1) % array.length];
                return {
                    start,
                    end,
                    size: width
                };
            });
            let lineGeo = makeLine(boards, color);
            let line = new AMap.Object3D.Mesh();
            line.geometry.vertices.push(...lineGeo.vertices);
            line.geometry.vertexColors.push(...lineGeo.colors);
            line.geometry.faces.push(...lineGeo.faces);
            line.transparent = true;
            line.backOrFront = "both";
            object3Dlayer.add(line);

            var topColor = [0, 1, 1, 0.9];
            var topFaceColor = [0, 1, 1, 0.4];
            var bottomColor = [0, 0, 1, 0.9];

            //添加一个圆柱体
            // var addRegularPrism = function(center, segment, height, radius) {
            //     var cylinder = new AMap.Object3D.Mesh();
            //     var geometry = cylinder.geometry;
            //     var verticesLength = segment * 2;
            //     var path = [];
            //     for (var i = 0; i < segment; i += 1) {
            //         var angle = (2 * Math.PI * i) / segment;
            //         var x = center.x + Math.cos(angle) * radius;
            //         var y = center.y + Math.sin(angle) * radius;
            //         path.push([x, y]);
            //         geometry.vertices.push(x, y, 0); //底部顶点
            //         geometry.vertices.push(x, y, -height); //顶部顶点

            //         geometry.vertexColors.push.apply(
            //             geometry.vertexColors,
            //             bottomColor
            //         ); //底部颜色
            //         geometry.vertexColors.push.apply(
            //             geometry.vertexColors,
            //             topColor
            //         ); //顶部颜色

            //         var bottomIndex = i * 2;
            //         var topIndex = bottomIndex + 1;
            //         var nextBottomIndex = (bottomIndex + 2) % verticesLength;
            //         var nextTopIndex = (bottomIndex + 3) % verticesLength;

            //         geometry.faces.push(bottomIndex, topIndex, nextTopIndex); //侧面三角形1
            //         geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex); //侧面三角形2
            //     }

            //     // 构建顶面三角形,为了区分顶面点和侧面点使用不一样的颜色,所以需要独立的顶点
            //     for (var i = 0; i < segment; i += 1) {
            //         geometry.vertices.push.apply(
            //             geometry.vertices,
            //             geometry.vertices.slice(i * 6 + 3, i * 6 + 6)
            //         ); //底部顶点
            //         geometry.vertexColors.push.apply(
            //             geometry.vertexColors,
            //             topFaceColor
            //         );
            //     }

            //     var triangles = AMap.GeometryUtil.triangulateShape(path);
            //     var offset = segment * 2;

            //     for (var v = 0; v < triangles.length; v += 3) {
            //         geometry.faces.push(
            //             triangles[v] + offset,
            //             triangles[v + 2] + offset,
            //             triangles[v + 1] + offset
            //         );
            //     }

            //     cylinder.transparent = true; // 如果使用了透明颜色，请设置true
            //     object3Dlayer.add(cylinder);
            // };
            let prism = new AMap.Object3D.Mesh();
            let prismMesh = makePrism(tranO(map.getCenter()), 10, 1400, 800, [
                0.5,
                0.5,
                0.5,
                0.5
            ]);

            prism.geometry.vertices.push(...prismMesh.vertices);
            prism.geometry.vertexColors.push(...prismMesh.colors);
            prism.geometry.faces.push(...prismMesh.faces);
            prism.transparent = true;
            prism.backOrFront = "both";
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
