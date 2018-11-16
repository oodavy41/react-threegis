import anime from "animejs";
class animeObj {
    // delta pre second
    constructor(
        obj,
        target,
        duration,
        wait = 0,
        loop = false,
        easing = "linear",
        direction = "alternate",
        autoplay = true
    ) {
        this.parent = obj;
        this.anime = anime({
            targets: this._getT(),
            x: target[0],
            y: target[1],
            z: target[2],
            easing: easing,
            direction: direction,
            loop: loop,
            duration: duration,
            delay: wait
        });
        this.anime.autoplay = autoplay;
    }
    start() {
        this.anime.play();
    }

    tick(delta) {}

    _getT() {
        console.error("SHOUD'NT USE PROP _getT()");
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

export class colAnimi {
    constructor(
        obj,
        target,
        duration,
        wait = 0,
        loop = false,
        easing = "linear",
        direction = "alternate",
        autoplay = true
    ) {
        this.parent = obj;
        if (this._getT()) {
            this.anime = anime({
                targets: this._getT(),
                r: target[0],
                g: target[1],
                b: target[2],
                easing: easing,
                direction: direction,
                loop: loop,
                duration: duration,
                delay: wait
            });
        } else {
            console.log("SETTING COLOR FAIL ! NOT BASIC MATERIAL ");
        }
    }

    tick(delta) {}

    _getT() {
        return this.parent.obj.material.color;
    }
}

export class recAnimi {
    thisTick = { x: 0, y: 0, z: 0 };
    lastTick = { x: 0, y: 0, z: 0 };
    result = [0, 0, 0];
    constructor(
        obj,
        animeFun,
        duration,
        target,
        wait = 0,
        loop = false,
        easing = "linear",
        direction = "alternate",
        autoplay = true
    ) {
        this.parent = obj;
        this.anime = anime({
            targets: this.thisTick,
            x: target[0],
            y: target[1],
            z: target[2],
            easing: easing,
            direction: direction,
            loop: loop,
            duration: duration,
            delay: wait
        });
        this.anime.autoplay = autoplay;
        if (animeFun) {
            this.anime.update = () => animeFun(obj, this.tick());
        }
    }

    tick() {
        this.result[0] = this.thisTick.x - this.lastTick.x;
        this.result[1] = this.thisTick.y - this.lastTick.y;
        this.result[2] = this.thisTick.z - this.lastTick.z;
        this.lastTick.x = this.thisTick.x;
        this.lastTick.y = this.thisTick.y;
        this.lastTick.z = this.thisTick.z;
        return this.result;
    }
}
