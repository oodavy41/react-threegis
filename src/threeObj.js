import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";
OBJLoader(THREE);

export class threeObj {
  constructor(obj) {
    this.obj = obj;
    this.animations = {
      POSITION: null,
      ROTATION: null,
      SCALE: null
    };
  }
  update(delta) {
    for (var key in this.animations) {
      var _ = this.animations[key];
      _ && _.tick(delta);
    }
  }
  addAnimi(type, from, to, duration, dVector) {
    this.animations[type] = new animateObj(
      this,
      type,
      from,
      to,
      duration,
      dVector
    );
  }
  rmAnimi(type) {
    this.animations[type] = null;
  }
}

export class animateObj {
  static POS = "POSITION";
  static ROT = "ROTATION";
  static SLE = "SCALE";

  // type animateObj.POS/ROT/SLE
  // unlimite duration = null with dVector | per seconds
  constructor(obj, type, from, to, duration, dVector) {
    this.obj = obj;
    this.type = type;
    this.from = from ? from : this.get().clone();
    this.to = to ? to : this.get().clone();
    this.duration = duration;
    this.life = 0;
    this.dVector = dVector;
  }
  tick(delta) {
    this.life += delta;
    if (this.duration) {
      if (this.life > this.duration) {
        return;
      }
      var progress = this.life / this.duration;
      var from = this.from ? this.from : this.get();
      var to = this.to ? this.to : this.get();
      this.get().lerpVectors(from, to, progress);
    } else {
      var euler = this.get();
      euler.x += this.dVector.x * delta;
      euler.y += this.dVector.y * delta;
      euler.z += this.dVector.z * delta;
    }
  }
  get() {
    switch (this.type) {
      case animateObj.POS:
        return this.obj.obj.position;
      case animateObj.ROT:
        return this.obj.obj.rotation;
      case animateObj.SLE:
        return this.obj.obj.scale;
    }
  }
}
