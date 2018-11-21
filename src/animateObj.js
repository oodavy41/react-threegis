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

class recAnime {
    parent = null;
    anime = null;
    result = [0, 0, 0];
    thisTick;
    lastTick;
    constructor(obj, start, animeFun, animeArray) {
        this.parent = obj;
        this.array = animeArray;
    }

    nextFun(animeFun) {
        let meta = this.array.shift();
        if (meta) {
            this.anime = anime({
                targets: this.thisTick,
                x: meta.target[0],
                y: meta.target[1],
                z: meta.target[2],
                easing: meta.easing || "linear",
                direction: meta.direction || "alternate",
                loop: meta.loop || false,
                duration: meta.duration,
                delay: meta.wait || 0,
                autoplay: meta.autoplay || true,
                update: () => animeFun(this.parent, this.tick()),
                complete: () => this.nextFun(animeFun)
            });
        }
    }
    tick() {
        this.lastTick.x = this.thisTick.x;
        this.lastTick.y = this.thisTick.y;
        this.lastTick.z = this.thisTick.z;
        return this.result;
    }
}

export class recAnimeScl extends recAnime {
    constructor(obj, start, animeFun, animeArray) {
        let { x, y, z } = (start && { x: start[0], y: start[1], z: start[2] }) || {
            x: 1,
            y: 1,
            z: 1
        };
        super(obj, start, animeFun, animeArray);
        this.thisTick = { x, y, z };
        this.lastTick = { x, y, z };
        this.nextFun(animeFun);
    }

    tick() {
        this.result[0] = this.thisTick.x / this.lastTick.x;
        this.result[1] = this.thisTick.y / this.lastTick.y;
        this.result[2] = this.thisTick.z / this.lastTick.z;
        return super.tick();
    }
}

export class recAnimeRot extends recAnime {
    constructor(obj, start, animeFun, animeArray) {
        let { x, y, z } = (start && { x: start[0], y: start[1], z: start[2] }) || {
            x: 0,
            y: 0,
            z: 0
        };
        super(obj, start, animeFun, animeArray);
        this.thisTick = { x, y, z };
        this.lastTick = { x, y, z };
        this.nextFun(animeFun);
    }

    tick() {
        this.result[0] = this.thisTick.x - this.lastTick.x;
        this.result[1] = this.thisTick.y - this.lastTick.y;
        this.result[2] = this.thisTick.z - this.lastTick.z;
        return super.tick();
    }
}
export class recAnimePos extends recAnime {
    constructor(obj, start, animeFun, animeArray) {
        if (!start) {
            console.error("position anime must have start value");
        }
        super(obj, start, animeFun, animeArray);
        this.thisTick = { x: start[0], y: start[1], z: start[2] };
        this.nextFun(animeFun);
    }

    tick() {
        this.result[0] = this.thisTick.x;
        this.result[1] = this.thisTick.y;
        this.result[2] = this.thisTick.z;
        return this.result;
    }
}
