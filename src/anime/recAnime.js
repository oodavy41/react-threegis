import anime from "animejs";
export default class recAnime {
    /**
     * @param {number[]} target
     * @param {{target:number[],duration:number,easing?:string,direction?:string,loop?:boolean,wait?:number,autoplay?:boolean}[]} animeArray
     */
    constructor(target, animeArray) {
        this.target = target;
        this.array = animeArray;
        this.result = [0, 0, 0];
        this._nextFun();
    }
    _nextFun() {
        let meta = this.array.shift();
        if (meta) {
            this.anime = anime({
                targets: this.target,
                x: meta.target[0],
                y: meta.target[1],
                z: meta.target[2],
                easing: meta.easing || "linear",
                direction: meta.direction || "alternate",
                loop: meta.loop || false,
                duration: meta.duration,
                delay: meta.wait || 0,
                autoplay: meta.autoplay || true,
                complete: () => {
                    this._nextFun();
                    //console.log("anime update", this.target);
                }
            });
        }
    }
}
