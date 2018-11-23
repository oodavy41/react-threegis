import { makeLine, makePanel, makeDot, makePrism } from "./tools/GLMesh";
import AMapObj from "./object/amapObj";

export default class AMapScene {
    constructor(AMap, map) {
        this.AMapObjs = {};
        this.UpdtObjs = {};
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
        for (let key in this.AMapObjs) {
            this.object3Dlayer.remove(this.AMapObjs[key]);
        }
        this.AMapObjs = [];
        this.data = data;
        this.setup(data);
    }
    tranO(pos) {
        return this.map.lngLatToGeodeticCoord(pos);
    }
    setup(data) {
        this.AMapObjs = {};
        this.UpdtObjs = {};
        data &&
            data.forEach(e => {
                let _, obj;
                switch (e.type) {
                    case "dot":
                        obj = new AMapObj(
                            this.AMap,
                            makeDot(e.height, e.radius, e.color, e.colorFun)
                        );
                        obj.position = {
                            x: e.position[0],
                            y: e.position[1],
                            z: e.position[2] || 0
                        };
                        _ = Math.random();
                        this.AMapObjs[`dot${_}`] = obj.obj;
                        this.UpdtObjs[`dot${_}`] = obj;
                        break;
                    case "border":
                        obj = new AMapObj(
                            this.AMap,
                            this.objBorder(e.points, e.height, e.width, e.color),
                            false
                        );
                        _ = Math.random();
                        this.AMapObjs[`border${_}`] = obj.obj;
                        this.UpdtObjs[`border${_}`] = obj;
                        break;
                    case "prism":
                        let h = e.height;
                        obj = new AMapObj(
                            this.AMap,
                            makePrism(e.segment, h, e.radius, e.color, e.colorFun)
                        );
                        obj.position = {
                            x: e.position[0],
                            y: e.position[1],
                            z: e.position[2] || 0
                        };
                        this.AMapObjs[`text${e.name}`] = new this.AMap.Text({
                            text: e.name,
                            position: e.position,
                            height: h,
                            map: this.map,
                            style: {
                                "background-color": "rgba(0,0,0,0)",
                                "border-color": "rgba(0,0,0,0)",
                                color: "white",
                                "font-size": "12px"
                            }
                        });
                        this.AMapObjs[`prism${e.name}`] = obj.obj;
                        this.UpdtObjs[`prism${e.name}`] = obj;
                        break;
                    case "panel":
                        obj = new AMapObj(
                            this.AMap,
                            this.objPanel(e.points, e.height, e.color)
                        );
                        this.AMapObjs[`panel${e}`] = obj.obj;
                        this.UpdtObjs[`panel${e}`] = obj;
                        break;
                    default:
                        console.error("wrong type", e);
                        break;
                }
                if (e.scaleAnime) {
                    obj.setAnimeScl(e.scaleAnime.array, e.scaleAnime.start);
                }
                if (e.rotateAnime) {
                    obj.setAnimeRot(e.rotateAnime.array, e.rotateAnime.start);
                }
                if (e.posAnime) {
                    obj.setAnimePos(e.posAnime.array, e.posAnime.start);
                }
                this.object3Dlayer.add(obj.obj);
            });
    }
    update() {
        // animation
        for (let key in this.UpdtObjs) {
            let m = this.UpdtObjs[key];
            m.update();
        }
        // == end ==
        this.AMap.Util.requestAnimFrame(() => {
            this.update();
        });
    }

    objPanel(points, height, color) {
        points = points.map(e => {
            let ce = this.tranO(e);
            return [ce.x, ce.y, -height];
        });
        return makePanel(points, color);
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
        return makeLine(border, color);
    }
}
