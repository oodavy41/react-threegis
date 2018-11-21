import anime from "animejs";

export default class baseMapCamera {
    constructor(aim, pitch, rotate, zoom) {
        this.aimx = aim[0];
        this.aimy = aim[1];
        this.pitch = pitch;
        this.rotate = rotate;
        this.zoom = zoom;
        this.anime = null;
    }

    setTrail(array, animeFun) {
        this.array = array;
        this._nextFun(animeFun);
    }

    _nextFun(animeFun) {
        let meta = this.array.shift();
        if (meta) {
            this.anime = anime({
                targets: this,
                aimx: meta.aim[0],
                aimy: meta.aim[1],
                pitch: meta.pitch,
                rotate: meta.rotate,
                zoom: meta.zoom,
                easing: meta.easing || "linear",
                direction: meta.direction || "alternate",
                loop: meta.loop || false,
                duration: meta.duration,
                delay: meta.wait || 0,
                autoplay: meta.autoplay || true,
                update: () => animeFun(this._tick()),
                complete: () => this._nextFun(animeFun)
            });
        }
    }

    _tick() {
        return {
            x: this.aimx,
            y: this.aimy,
            pitch: this.pitch,
            rotate: this.rotate,
            zoom: this.zoom
        };
    }
}
