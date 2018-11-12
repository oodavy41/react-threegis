import * as THREE from "three";
import { tranToArc } from "./arcTools";

export default class meshBuilder {
  scene = null;
  constructor(scene) {
    this.scene = scene;
  }
  makeLine(array, color) {
    let lineGeomentry = new THREE.Geometry();
    array.forEach(element => {
      let start = element.start;
      let end = element.end;
      let width = element.size / 2;
      let angle = Math.atan2(
        end[1] - start[1],
        end[0] - start[0]
      );
      let pos = lineGeomentry.vertices.length;
      let dx = width * Math.sin(angle);
      let dy = width * Math.cos(angle);
      lineGeomentry.vertices.push(
        new THREE.Vector3().fromArray(
          tranToArc(this.scene, [
            start[0] + dx,
            start[1] - dy,
            start[2]
          ])
        ),
        new THREE.Vector3().fromArray(
          tranToArc(this.scene, [
            start[0] - dx,
            start[1] + dy,
            start[2]
          ])
        ),
        new THREE.Vector3().fromArray(
          tranToArc(this.scene, [
            end[0] + dx,
            end[1] - dy,
            end[2]
          ])
        ),
        new THREE.Vector3().fromArray(
          tranToArc(this.scene, [
            end[0] - dx,
            end[1] + dy,
            end[2]
          ])
        ),
        new THREE.Vector3().fromArray(
          tranToArc(this.scene, start)
        )
      );
      for (let i = 0; i < 16; i++) {
        lineGeomentry.vertices.push(
          new THREE.Vector3().fromArray(
            tranToArc(this.scene, [
              start[0] + width * Math.sin((Math.PI * i) / 8),
              start[1] + width * Math.cos((Math.PI * i) / 8),
              start[2]
            ])
          )
        );
      }
      lineGeomentry.faces.push(
        new THREE.Face3(pos, pos + 2, pos + 1),
        new THREE.Face3(pos + 1, pos + 2, pos + 3)
      );

      for (let i = 0; i < 16; i++) {
        lineGeomentry.faces.push(
          new THREE.Face3(
            pos + 4,
            i < 15 ? pos + 6 + i : pos + 5,
            pos + 5 + i
          )
        );
      }
    });

    return new THREE.Mesh(
      lineGeomentry,
      new THREE.MeshBasicMaterial({ color: color })
    );
  }

  makeDot(location, color, radius) {
    let geometry = new THREE.CircleBufferGeometry(radius, 32);
    let material = new THREE.MeshBasicMaterial({ color: color });
    let dot = new THREE.Mesh(geometry, material);
    dot.baseMat = material;
    dot.choseMat = this.scene.materials.brightRed;
    dot.position.fromArray(tranToArc(this.scene, location));
    return dot;
  }
  makeDotTransport(location, color, radius, opacity) {
    let geometry = new THREE.CircleBufferGeometry(radius, 32);
    let material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity
    });
    let dot = new THREE.Mesh(geometry, material);
    dot.position.fromArray(tranToArc(this.scene, location));
    return dot;
  }
}
