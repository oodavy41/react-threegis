import { makeLine, makePanel, makeDot, makePrism } from "./GLMesh";
import { recAnimeScl, recAnimeRot, recAnimePos } from "./animateObj";

export default class AMapScene {
    constructor(AMap, map) {
        this.models = {};
        this.map = map;
        this.AMap = AMap;
        this.object3Dlayer = new AMap.Object3DLayer();
        this.animeLoop = 0;
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
                    default:
                        console.error("wrong type", e);
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
