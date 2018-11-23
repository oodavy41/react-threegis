import baseObj from "./baseObj";
import recAnime from "../anime/recAnime";
export default class AMapObj extends baseObj {
    constructor(AMap, mesh, update = true, both = false) {
        super(mesh);
        this.AMap = AMap;
        this.UPDATE = update; //高德地图初始化会更改原点，世界坐标绘制不能动画
        this._lastScale = { x: 1, y: 1, z: 1 };
        this._lastRotation = { x: 0, y: 0, z: 0 };
        this.obj = new AMap.Object3D.Mesh();
        this.obj.geometry.vertices.push(...this.vertices);
        this.obj.geometry.vertexColors.push(...this.colors);
        this.obj.geometry.faces.push(...this.faces);
        this.obj.transparent = true;
        this.obj.backOrFront = both ? "both" : "back";
    }

    update() {
        if (this.UPDATE) {
            this.obj.position([this.position.x, this.position.y]);
            this.obj.scale(
                this.scale.x / this._lastScale.x,
                this.scale.y / this._lastScale.y,
                this.scale.z / this._lastScale.z
            );
            this._lastScale.x = this.scale.x;
            this._lastScale.y = this.scale.y;
            this._lastScale.z = this.scale.z;
            this.obj.rotateX(this.rotation.x - this._lastRotation.x);
            this._lastRotation.x = this.rotation.x;
            this.obj.rotateY(this.rotation.y - this._lastRotation.y);
            this._lastRotation.y = this.rotation.y;
            this.obj.rotateZ(this.rotation.z - this._lastRotation.z);
            this._lastRotation.z = this.rotation.z;
        }
    }

    setAnimePos(animeArray, start = undefined) {
        if (start) {
            this.position = { x: start[0], y: start[1], z: start[2] };
        }
        this.posAnime = new recAnime(this.position, animeArray);
    }
    setAnimeScl(animeArray, start = undefined) {
        if (start) {
            this.scale = { x: start[0], y: start[1], z: start[2] };
        }
        this.sclAnime = new recAnime(this.scale, animeArray);
    }
    setAnimeRot(animeArray, start = undefined) {
        if (start) {
            this.rotation = { x: start[0], y: start[1], z: start[2] };
        }
        this.rotAnime = new recAnime(this.rotation, animeArray);
    }
}
