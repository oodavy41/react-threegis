import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";
import {
  posAnimi,
  sclAnimi,
  colAnimi,
  rotAnimi
} from "./animateObj";
OBJLoader(THREE);

export const aniType = {
  POS: "POSITION",
  ROT: "ROTATION",
  SLE: "SCALE",
  COL: "COLOR"
};
export class threeObj {
  // will clean all exists same type _animations
  set position(array) {
    this.obj.position.fromArray(array);
    this._position = this.obj.position.clone();
    this._animiChange.POSITION = true;
  }
  get position() {
    return this._position;
  }

  set scale(array) {
    this.obj.scale.fromArray(array);
    this._scale = this.obj.scale.clone();
    this._animiChange.SCALE = true;
  }
  get scale() {
    return this._scale;
  }

  set rotation(array) {
    this.obj.rotation.fromArray(array);
    this._rotation = this.obj.rotation.clone();
    this._animiChange.ROTATION = true;
  }
  get rotation() {
    return this._rotation;
  }

  constructor(obj) {
    this.obj = obj;
    this._animations = [];
    this._animiChange = {
      POSITION: false,
      ROTATION: false,
      SCALE: false
    };
    this._position = obj.position.clone();
    this._scale = obj.scale.clone();
    this._rotation = obj.rotation.clone();
  }

  update(delta) {
    for (var key in this._animations) {
      var _ = this._animations[key];
      if (_ && _.tick(delta)) {
        this._animations.splice(key);
      }
    }
  }
  /**
   *
   * @param {aniType} type
   * @param {*} dArray if type is color array is target
   * @param {*} duration
   * @param {*} wait
   */
  addAnimi(type, dArray, duration, wait = 0) {
    let newAnime;
    switch (type) {
      case aniType.POS:
        newAnime = new posAnimi(this, dArray, duration, wait);
        break;
      case aniType.ROT:
        newAnime = new rotAnimi(this, dArray, duration, wait);
        break;
      case aniType.SLE:
        newAnime = new sclAnimi(this, dArray, duration, wait);
        break;
      case aniType.COL:
        newAnime = new colAnimi(this, dArray, duration, wait);
        break;
    }
    return this._animations.push(newAnime);
  }
  rmAnimi(id) {
    this._animations.splice(id);
  }

  reset() {
    this._animations = [];
    this.obj.position = this.position;
    this.obj.scale = this.scale;
    this.obj.rotation = this.rotation;
  }
}
