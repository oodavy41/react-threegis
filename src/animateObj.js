import { threeObj } from "./threeObj";
class animeObj {
  // delta pre second
  constructor(obj, delta, duration, wait = 0) {
    this.parent = obj;
    this.duration = duration
      ? duration
      : Number.POSITIVE_INFINITY;
    this.wait = wait;
    this.life = 0;
    this.delta = delta;
  }

  tick(delta) {
    if (this.wait > 0) {
      this.wait -= delta;
      return false;
    } else if (this.duration > 0) {
      this.duration -= delta;
      let _t = this._getT();
      _t.x += this.delta[0] * delta;
      _t.y += this.delta[1] * delta;
      _t.z += this.delta[2] * delta;
      return false;
    } else {
      return true;
    }
  }

  _getT() {
    console.error("NO USE");
    return null;
  }
}

export class posAnimi extends animeObj {
  _getT() {
    return this.parent.obj.position;
  }
}
export class sclAnimi extends animeObj {
  _getT() {
    return this.parent.obj.scale;
  }
}
export class rotAnimi extends animeObj {
  _getT() {
    return this.parent.obj.rotation;
  }
}

export class colAnimi extends animeObj {
  constructor(obj, target, duration, wait = 0) {
    this.oldColor = this.parent.obj.material.color;
    if (this.oldColor && duration) {
      this.oldColor = this.oldColor.clone();
      this.life = duration + 0.02;
      super(obj, target, duration, wait);
    } else {
      console.log("SETTING COLOR FAIL ! NOT BASIC MATERIAL ");
      super(obj, target, -1, -1);
    }
  }

  tick(delta) {
    if (this.wait > 0) {
      this.wait -= delta;
      return false;
    } else if (this.duration > 0) {
      this.duration -= delta;
      let _t = this._getT();
      _t.lerp(
        this.oldColor,
        delta / this.life / (1 - this.duration / this.life)
      );
      return false;
    } else {
      return true;
    }
  }

  _getT() {
    return this.parent.obj.material.color;
  }
}
