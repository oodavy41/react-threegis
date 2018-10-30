import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";
OBJLoader(THREE);

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
      if (_ && !this._animiChange[_.type] && _.tick(delta)) {
        this._animations.splice(key);
      }
    }

    this._animiChange.POSITION = false;
    this._animiChange.ROTATION = false;
    this._animiChange.SCALE = false;
  }
  /**
   *
   * @param {animateObj.POS|animateObj.ROT|animateObj.SLE} type
   * @param {number[]} from
   * @param {number[]} to
   * @param {number} duration null means infinity
   * @param {number[]} dArray per second
   * @returns {number} animate ID in this object
   */
  addAnimi(type, from, to, duration, dArray) {
    return this._animations.push(
      new animateObj(this, type, from, to, duration, dArray)
    );
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

export class animateObj {
  static POS = "POSITION";
  static ROT = "ROTATION";
  static SLE = "SCALE";

  /**
   *
   * @param {threeObj} obj
   * @param {animateObj.POS/ROT/SLE} type
   * @param {Array} from
   * @param {Array} to
   * @param {Float} duration  null means infinity
   * @param {Array} dArray  per seconds
   */
  constructor(obj, type, from, to, duration, dArray) {
    this.parent = obj;
    this.type = type;
    this.from = from
      ? new THREE.Vector3().fromArray(from)
      : this._getP().clone();
    this.to = to
      ? new THREE.Vector3().fromArray(to)
      : this._getP().clone();
    this.duration = duration;
    this.life = 0;
    this.D = dArray;
  }
  tick(delta) {
    this.life += delta;
    if (this.duration) {
      if (this.life > this.duration) {
        return true;
      }
      var progress = this.life / this.duration;
      if (this.type !== animateObj.ROT) {
        this._getT().lerpVectors(this.from, this.to, progress);
      } else {
        this._getT().fromArray([
          this.from.x * (1 - progress) + this.to.x * progress,
          this.from.y * (1 - progress) + this.to.y * progress,
          this.from.z * (1 - progress) + this.to.z * progress
        ]);
      }
    } else {
      var euler = this._getT();
      euler.x += this.D[0] * delta;
      euler.y += this.D[1] * delta;
      euler.z += this.D[2] * delta;
    }
    return false;
  }
  _getP() {
    switch (this.type) {
      case animateObj.POS:
        return this.parent.position;
      case animateObj.ROT:
        return this.parent.rotation;
      case animateObj.SLE:
        return this.parent.scale;
    }
  }

  _getT() {
    switch (this.type) {
      case animateObj.POS:
        return this.parent.obj.position;
      case animateObj.ROT:
        return this.parent.obj.rotation;
      case animateObj.SLE:
        return this.parent.obj.scale;
    }
  }
}
