import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";
import { threeObj, animateObj, aniType } from "./threeObj";
import { Map } from "react-arcgis";
OBJLoader(THREE);

export default class TScene {
  THREE = THREE;
  clock = null;
  view = null;
  arcgisRender = null;
  arcgisReference = null;

  mapSize = 0;

  renderer = null;
  camera = null;
  scene = null;
  terraria = null;

  model = null;
  choosePlane = null;
  modelMat = null;
  modelScale = 40;
  mouseCoord = null;
  mousePoses = null;
  chooseRange = {
    x1: -1,
    y1: -1,
    x2: -1,
    y2: -1
  };

  models = [];
  materials = {};

  setMousePos(mousePos, presentPos) {
    this.mousePoses = mousePos;
    this.mouseCoord = presentPos;
  }

  constructor(view, render, reference, center, mapSize) {
    this.view = view;
    this.arcgisRender = render;
    this.arcgisReference = reference;
    this.origin = { x: center[0], y: center[1] };
    this.mapSize = mapSize;
    this.materials["brightRed"] = new THREE.MeshBasicMaterial({
      color: "red"
    });
  }
  setup(context) {
    this.renderer = new THREE.WebGLRenderer({
      context: context.gl,
      premultipliedAlpha: false
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setViewport(
      0,
      0,
      this.view.width,
      this.view.height
    );
    this.renderer.autoClearDepth = false;
    this.renderer.autoClearStencil = false;
    this.renderer.autoClearColor = false;

    var originalSetRenderTarget = this.renderer.setRenderTarget.bind(
      this.renderer
    );
    this.renderer.setRenderTarget = function(target) {
      originalSetRenderTarget(target);
      if (target == null) {
        context.bindRenderTarget();
      }
    };

    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock(true);

    this.camera = new THREE.PerspectiveCamera();

    this.terraria = new THREE.Mesh(
      new THREE.PlaneGeometry(this.mapSize, this.mapSize),
      new THREE.MeshBasicMaterial({ color: "pink" })
    );
    this.terraria.position.fromArray(
      this.tranToArc([this.mapSize / 2, this.mapSize / 2, -10])
    );
    this.scene.add(this.terraria);

    let geo = new THREE.PlaneGeometry(1, 1);
    geo.applyMatrix(
      new THREE.Matrix4().makeTranslation(0.5, 0.5, 0)
    );

    this.choosePlane = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: "black",
        transparent: true,
        opacity: 0.5
      })
    );

    this.choosePlane.position.fromArray(
      this.tranToArc([300, 300, 50])
    );
    this.choosePlane.scale.fromArray([1, 1, 0]);
    this.scene.add(this.choosePlane);

    var loader = new this.THREE.OBJLoader();
    loader.load("assets/teapot.obj", object3d => {
      console.log("teapot ready!!");
      this.model = object3d;
      this.modelMat = new THREE.MeshNormalMaterial();

      this.model.traverse(
        function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = this.modelMat;
          }
        }.bind(this)
      );

      this.model.scale.set(
        this.modelScale,
        this.modelScale,
        this.modelScale
      );
      this.model.rotateX(Math.PI / 2);
      this.scene.add(this.model);

      context.resetWebGLState();
    });

    for (var i = 0; i < 5; i++) {
      let board = 50;
      let height = 300 + Math.random() * 300;
      let m = new THREE.Mesh(
        new THREE.CubeGeometry(board, board, height).applyMatrix(
          new THREE.Matrix4().makeTranslation(0, 0, height / 2)
        ),
        new THREE.MeshNormalMaterial()
      );
      let mobj = new threeObj(m);
      mobj.position = this.tranToArc([500, 700 + i * 700, 0]);
      mobj.addAnimi(
        aniType.ROT,
        [0, 0, Math.PI * 2],
        Math.random() * 5 + 5,
        0,
        true,
        "easeInOutQuart",
        "normal"
      );
      mobj.addAnimi(
        aniType.SLE,
        [
          Math.random() * 3,
          Math.random() * 3,
          Math.random() * 3
        ],
        10
      );
      mobj.addAnimi(
        aniType.POS,
        this.tranToArc([
          Math.random() * this.mapSize,
          700 * (i + 1),
          0
        ]),
        10 * Math.random() + 10,
        10 * Math.random(),
        true,
        "easeInOutBack",
        "normal"
      );

      this.scene.add(mobj.obj);
    }

    let line8 = this.makeLine(
      [
        {
          start: [0, 0, 50],
          end: [4500, 4500, 100],
          size: 200
        },
        {
          end: [4000, 2000, 200],
          start: [4500, 4500, 100],
          size: 200
        },
        {
          end: [100, 4900, 300],
          start: [4000, 2000, 200],
          size: 200
        },
        {
          start: [100, 4900, 300],
          end: [0, 0, 0],
          size: 200
        }
      ],
      0xff55ff,
      true
    );
    this.scene.add(line8);

    for (let i = 0; i < 200; i++) {
      let pos = [
        Math.random() * this.mapSize,
        Math.random() * this.mapSize,
        5 + 10 * Math.random()
      ];
      let dot1 = this.makeDot(pos, 0x9999ee, 50);
      let dothalf = this.makeDotTransport(
        pos,
        0x9999ee,
        70 + 50 * Math.random(),
        0.3
      );
      let dothalfm = new threeObj(dothalf);
      dothalfm.addAnimi(
        aniType.COL,
        [Math.random(), Math.random(), Math.random()],
        5,
        0,
        true
      );
      dothalfm.addAnimi(
        aniType.SLE,
        [1.3, 1.3, 1],
        1,
        0.5 + Math.random(),
        true,
        "easeOutBack"
      );
      this.models.push(dot1);
      this.scene.add(dot1);
      this.scene.add(dothalf);
    }

    let m = new THREE.Mesh(
      new THREE.CubeGeometry(200, 200, 500).applyMatrix(
        new THREE.Matrix4().makeTranslation(0, 0, 250)
      ),
      new THREE.MeshNormalMaterial()
    );

    m.position.fromArray(this.tranToArc([300, 300, 0]));
    this.scene.add(m);

    this.makeOrigin(this.scene);
    var light = new THREE.DirectionalLight(0x202020);
    this.scene.add(light);
  }
  render(context) {
    var delta = this.clock.getDelta();
    var time = this.clock.getElapsedTime();

    var cam = context.camera;

    this.camera.aspect = cam.aspect;
    this.camera.fov = cam.fov;
    this.camera.near = cam.near;
    this.camera.far = cam.far;

    this.camera.position.fromArray(cam.eye);

    this.camera.up.fromArray(cam.up);
    this.camera.lookAt(
      cam.center[0],
      cam.center[1],
      cam.center[2]
    );

    this.camera.updateProjectionMatrix();
    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);

    // console.log(this.camera, context.cam);

    // models update
    if (this.model) {
      var dis = this.mapSize / 2;
      var renderPos = [
        dis + 1000 * Math.cos(time / 3),
        dis + 1000 * Math.sin(time / 3),
        100
      ];
      this.model.position.fromArray(this.tranToArc(renderPos));
    }

    this.rayCast();

    // draw the scene
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);

    // as we want to smoothly animate the ISS movement, immediately request a re-render
    this.arcgisRender.requestRender(this.view);

    // cleanup
    context.resetWebGLState();
  }

  tranToArc(renderPos) {
    var pos = [
      renderPos[0] + this.origin.x,
      renderPos[1] + this.origin.y,
      renderPos[2]
    ];
    this.arcgisRender.toRenderCoordinates(
      this.view,
      pos,
      0,
      this.arcgisReference.WebMercator,
      pos,
      0,
      1
    );
    return pos;
  }
  makeOrigin() {
    var cubex = new THREE.Mesh(
      new THREE.BoxGeometry(100, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    var cubey = new THREE.Mesh(
      new THREE.BoxGeometry(10, 100, 10),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );

    var cubez = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 100),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );

    var center = 100;
    cubex.position.fromArray(
      this.tranToArc([center + 50, center, 100])
    );
    this.scene.add(cubex);
    cubey.position.fromArray(
      this.tranToArc([center, center + 50, 100])
    );
    this.scene.add(cubey);
    cubez.position.fromArray(
      this.tranToArc([center, center, 150])
    );
    this.scene.add(cubez);
  }

  /**
   *
   * @param {*} array [{start:[x,y,z],end:[x,y,z],size:widthNumber},...]
   * @param {*} color
   */
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
          this.tranToArc([
            start[0] + dx,
            start[1] - dy,
            start[2]
          ])
        ),
        new THREE.Vector3().fromArray(
          this.tranToArc([
            start[0] - dx,
            start[1] + dy,
            start[2]
          ])
        ),
        new THREE.Vector3().fromArray(
          this.tranToArc([end[0] + dx, end[1] - dy, end[2]])
        ),
        new THREE.Vector3().fromArray(
          this.tranToArc([end[0] - dx, end[1] + dy, end[2]])
        ),
        new THREE.Vector3().fromArray(this.tranToArc(start))
      );
      for (let i = 0; i < 16; i++) {
        lineGeomentry.vertices.push(
          new THREE.Vector3().fromArray(
            this.tranToArc([
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
    dot.choseMat = this.materials.brightRed;
    dot.position.fromArray(this.tranToArc(location));
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
    dot.position.fromArray(this.tranToArc(location));
    return dot;
  }
  rayCast() {
    let my = this.chooseRange;
    let pa = this.mousePoses;
    let xmin, xmax, ymin, ymax;
    if (pa.readState) {
      pa.readState = false;
      my.x1 = pa.start[0];
      my.y1 = pa.start[1];
      my.x2 = pa.end[0];
      my.y2 = pa.end[1];
      if (!this.rayCaster) {
        this.rayCaster = new THREE.Raycaster();
      }
      let coord1 = {
        x: my.x1 * 2 - 1,
        y: -my.y1 * 2 + 1
      };
      let coord2 = {
        x: my.x2 * 2 - 1,
        y: -my.y2 * 2 + 1
      };
      this.rayCaster.setFromCamera(coord1, this.camera);
      let hits1 = this.rayCaster.intersectObject(this.terraria);
      this.rayCaster.setFromCamera(coord2, this.camera);
      let hits2 = this.rayCaster.intersectObject(this.terraria);

      if (hits1.length > 0 && hits2.length > 0) {
        let p1 = hits1[0].point,
          p2 = hits2[0].point;
        [xmin, xmax] = p1.x < p2.x ? [p1.x, p2.x] : [p2.x, p1.x];
        [ymin, ymax] = p1.y < p2.y ? [p1.y, p2.y] : [p2.y, p1.y];
      }
      this.models.forEach(element => {
        if (element.material) {
          let pos = element.position;
          if (
            pos.x < xmax &&
            pos.x > xmin &&
            pos.y < ymax &&
            pos.y > ymin
          ) {
            element.material = element.choseMat;
          } else {
            element.material = element.baseMat;
          }
        }
      });

      this.choosePlane.scale.x = 0.1;
      this.choosePlane.scale.y = 0.1;
    }
    if (pa.chooseState) {
      if (!this.rayCaster) {
        this.rayCaster = new THREE.Raycaster();
      }
      my.x1 = pa.start[0];
      my.y1 = pa.start[1];
      let coord = { x: my.x1 * 2 - 1, y: -my.y1 * 2 - 1 };
      this.rayCaster.setFromCamera(
        {
          x: my.x1 * 2 - 1,
          y: -my.y1 * 2 + 1
        },
        this.camera
      );
      let hit1 = this.rayCaster.intersectObject(this.terraria);

      this.rayCaster.setFromCamera(
        {
          x: this.mouseCoord.x * 2 - 1,
          y: -this.mouseCoord.y * 2 + 1
        },
        this.camera
      );
      let hit2 = this.rayCaster.intersectObject(this.terraria);

      if (hit1 && hit1.length > 0 && hit2 && hit2.length > 0) {
        let x = [hit1[0].point.x, hit2[0].point.x];
        let y = [hit1[0].point.y, hit2[0].point.y];
        let [xmin, xsize] =
          x[0] < x[1]
            ? [x[0], x[1] - x[0]]
            : [x[1], x[0] - x[1]];
        let [ymin, ysize] =
          y[0] < y[1]
            ? [y[0], y[1] - y[0]]
            : [y[1], y[0] - y[1]];
        this.choosePlane.position.x = xmin;
        this.choosePlane.position.y = ymin;
        this.choosePlane.scale.x = xsize;
        this.choosePlane.scale.y = ysize;
      }
    }
  }
}
