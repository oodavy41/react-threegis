import { makeLine, makePanel, makeDot, makePrism } from "./GLMesh";
import { recAnimeScl, recAnimeRot, recAnimePos } from "./animateObj";
import meshBuilder from "./threeMesh";
import { aniType } from "./threeObj";

export default class AMapScene {
    models = {};
    map = null;
    AMap = null;
    data = null;
    animeLoop = 0;
    constructor(AMap, map) {
        this.map = map;
        this.AMap = AMap;
        this.object3Dlayer = new AMap.Object3DLayer();
        map.add(this.object3Dlayer);
    }
    RUN() {
        console.log(
            "map loaded at ",
            this.map.getCenter(),
            this.tranO(this.map.getCenter())
        );
        this.setup(this.data);

        if (!this.animeLoop) {
            this.AMap.Util.cancelAnimFrame(this.animeLoop);
        }
        this.animeLoop = this.AMap.Util.requestAnimFrame(() => {
            this.update();
        });
    }
    reset(data) {
        for (let key in this.models) {
            this.object3Dlayer.remove(this.models[key]);
        }
        this.models = [];
        this.data = data;
        this.setup(data);
    }
    tranO(pos) {
        return this.map.lngLatToGeodeticCoord(pos);
    }
    setup(data) {
        this.models = {};
        let { lng, lat } = this.map.getCenter();
        data &&
            data.forEach(e => {
                let obj;
                switch (e.type) {
                    case "dot":
                        obj = this.Obj(
                            makeDot(e.height, e.radius, e.color, e.colorFun)
                        );
                        obj.position(e.position);
                        this.models[`dot${e}`] = obj;
                        break;
                    case "border":
                        obj = this.objBorder(e.points, e.height, e.width, e.color);
                        this.models[`border${e}`] = obj;
                        break;
                    case "prism":
                        let h = e.height;
                        obj = this.Obj(
                            makePrism(e.segment, h, e.radius, e.color, e.colorFun)
                        );
                        let pos = e.position;
                        obj.position(pos);
                        this.models[`text${e.name}`] = new this.AMap.Text({
                            text: e.name,
                            position: pos,
                            height: h,
                            map: this.map,
                            style: {
                                "background-color": "rgba(0,0,0,0)",
                                "border-color": "rgba(0,0,0,0)",
                                color: "white",
                                "font-size": "12px"
                            }
                        });
                        this.models[`prism${e.name}`] = obj;
                        break;
                    case "panel":
                        obj = this.objPanel(e.points, e.height, e.color);
                        this.models[`panel${e}`] = obj;
                        break;
                }
                if (e.scaleAnime) {
                    e.scaleAnime.start &&
                        obj.scale(
                            e.scaleAnime.start[0],
                            e.scaleAnime.start[1],
                            e.scaleAnime.start[2]
                        );
                    obj.scaleAnime = new recAnimeScl(
                        obj,
                        e.scaleAnime.start,
                        (obj, result) => {
                            obj.scale(result[0], result[1], result[2]);
                        },
                        e.scaleAnime.array
                    );
                }
                if (e.rotateAnime) {
                    e.rotateAnime.start &&
                        obj.scale(
                            e.rotateAnime.start[0],
                            e.rotateAnime.start[1],
                            e.rotateAnime.start[2]
                        );
                    obj.rotateAnime = new recAnimeRot(
                        obj,
                        e.rotateAnime.start,
                        (obj, result) => {
                            obj.rotateX(result[0]);
                            obj.rotateY(result[1]);
                            obj.rotateZ(result[2]);
                        },
                        e.rotateAnime.array
                    );
                }
                if (e.posAnime) {
                    e.posAnime.start &&
                        obj.position(
                            e.posAnime.start[0],
                            e.posAnime.start[1],
                            e.posAnime.start[2]
                        );
                    obj.posAnime = new recAnimePos(
                        obj,
                        e.posAnime.start,
                        (obj, result) => {
                            obj.scale(result[0], result[1], result[2]);
                        },
                        e.posAnime.array
                    );
                }
            });

        // let p1points = [
        //     [121.456256, 31.310258],
        //     [121.458214, 31.31122],
        //     [121.459351, 31.309905],
        //     [121.45713, 31.308851]
        // ];
        // let panel = this.objPanel(p1points, 1500, [0.7, 0.6, 0.5, 0.9]);
        // // == border
        // let points = [
        //     [121.463503, 31.306114],
        //     [121.463782, 31.304666],
        //     [121.455328, 31.303346],
        //     [121.455199, 31.313502],
        //     [121.455864, 31.316766],
        //     [121.4558, 31.320679],
        //     [121.457098, 31.320954],
        //     [121.465316, 31.321422],
        //     [121.465016, 31.319094],
        //     [121.468202, 31.319433],
        //     [121.468363, 31.316903],
        //     [121.467709, 31.306435]
        // ];
        // let height = 100;
        // let width = 100;
        // let color = [0.333, 0.345, 0.608, 1];
        // let line = this.objBorder(points, height, width, color);

        // // ==prism
        // for (let i = 0; i < 7; i++) {
        //     let h = 700 + 700 * Math.random();
        //     let prism = (this.models[`prism${i}`] = this.Obj(
        //         makePrism(
        //             3 + parseInt(2 * Math.random()),
        //             h,
        //             200,
        //             [1, 0.843, 0.643, 0.8],
        //             (x, y, z) => {
        //                 let c1 = [0.094, 0.271, 0.384, 0.8];
        //                 let c2 = [0.451, 0.588, 0.678, 0.8];
        //                 return z < -700 ? c2 : c1;
        //             }
        //         )
        //     ));
        //     let pos = [
        //         lng + (Math.random() * 2 - 1) * 0.004,
        //         lat + (Math.random() * 2 - 1) * 0.004
        //     ];
        //     prism.position(pos);
        //     prism.animeRZ = new recAnimi(
        //         false,
        //         prism,
        //         (obj, result) => {
        //             obj.rotateZ(result[2]);
        //         },
        //         20000,
        //         [0, 0, 360],
        //         0,
        //         true,
        //         undefined,
        //         "normal"
        //     );
        //     prism.scale(1, 1, 0.01);
        //     prism.animeShow = new recAnimi(
        //         true,
        //         prism,
        //         (obj, result) => {
        //             obj.scale(result[0], result[1], result[2]);
        //         },
        //         1000,
        //         [1, 1, 100],
        //         3000,
        //         false,
        //         "easeOutCubic",
        //         "normal"
        //     );
        //     let text = (this.models[`text${i}`] = new this.AMap.Text({
        //         text: `数据${i}`,
        //         position: pos,
        //         height: h,
        //         map: this.map,
        //         style: {
        //             "background-color": "rgba(0,0,0,0)",
        //             "border-color": "rgba(0,0,0,0)",
        //             color: "white",
        //             "font-size": "12px"
        //         }
        //     }));
        // }

        // // dots
        // for (let i = 0; i < 30; i++) {
        //     let dot = (this.models[`dot${i}`] = this.Obj(
        //         makeDot(20, 150, [0.878, 0.757, 0.416, 0.8])
        //     ));
        //     dot.position([
        //         lng + (Math.random() * 2 - 1) * 0.01,
        //         lat + (Math.random() * 2 - 1) * 0.01
        //     ]);
        //     dot.anime = new recAnimi(
        //         true,
        //         dot,
        //         (obj, result) => {
        //             obj.scale(result[0], result[1], result[2]);
        //         },
        //         500,
        //         [1.2, 1.2, 1],
        //         500 + Math.random() * 500,
        //         true
        //     );
        // }
    }
    update() {
        // animation
        for (let key in this.models) {
            let m = this.models[key];
            if (m.anime) {
                //m.rotateZ(m.anime.tick()[2]);
            }
        }
        // == end ==
        this.AMap.Util.requestAnimFrame(() => {
            this.update();
        });
    }

    Obj(Mesh, both = false) {
        let AMesh = new this.AMap.Object3D.Mesh();

        AMesh.geometry.vertices.push(...Mesh.vertices);
        AMesh.geometry.vertexColors.push(...Mesh.colors);
        AMesh.geometry.faces.push(...Mesh.faces);
        AMesh.transparent = true;
        AMesh.backOrFront = both ? "both" : "front";
        this.object3Dlayer.add(AMesh);
        return AMesh;
    }

    objPanel(points, height, color) {
        points = points.map(e => {
            let ce = this.tranO(e);
            return [ce.x, ce.y, -height];
        });
        let ret = (this.models["panel"] = this.Obj(makePanel(points, color)));
        return ret;
    }

    objBorder(points, height, width, color) {
        points = points.map(e => {
            let re = this.tranO(e);
            return [re.x, re.y, -height];
        });
        let border = points.map((point, index, array) => {
            let start = point;
            let end = array[(index + 1) % array.length];
            return { start, end, size: width };
        });
        return (this.models["line"] = this.Obj(makeLine(border, color)));
    }
}
