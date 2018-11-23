export default class baseObj {
    constructor(mesh) {
        this.vertices = mesh.vertices;
        this.colors = mesh.colors;
        this.faces = mesh.faces;
        this.position = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.posAnime = null;
        this.sclAnime = null;
        this.rotAnime = null;
    }

    update() {}
}
