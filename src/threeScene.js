import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";
import { threeObj, animateObj, aniType } from "./threeObj";
import { Map } from "react-arcgis";
OBJLoader(THREE);

export var TScene = {
  THREE: THREE,
  clock: null,
  view: null,
  arcgisRender: null,
  arcgisReference: null,

  mapSize: 0,

  renderer: null,
  camera: null,
  scene: null,

  model: null,
  modelMat: null,
  modelScale: 40,

  models: [],

  init(view, render, reference, center, mapSize) {
    this.view = view;
    this.arcgisRender = render;
    this.arcgisReference = reference;
    this.origin = { x: center[0], y: center[1] };
    this.mapSize = mapSize;
  },
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

      this.models.push(mobj);
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

    for (let i = 0; i < 20; i++) {
      let pos = [
        Math.random() * this.mapSize,
        Math.random() * this.mapSize,
        10
      ];
      let dot1 = this.makeDot(pos, 0x9999ee, 50);
      let dothalf = this.makeDotTransport(
        pos,
        0x9999ee,
        50 + 100 * Math.random(),
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
  },
  render(context) {
    var delta = this.clock.getDelta();
    var time = this.clock.getElapsedTime();

    var cam = context.camera;
    this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);

    this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    this.camera.lookAt(
      new THREE.Vector3(
        cam.center[0],
        cam.center[1],
        cam.center[2]
      )
    );

    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);

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
    this.models.forEach(element => {
      element.update(delta);
    });

    // draw the scene
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);

    // as we want to smoothly animate the ISS movement, immediately request a re-render
    this.arcgisRender.requestRender(this.view);

    // cleanup
    context.resetWebGLState();
  },

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
  },
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
  },

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
      let tan = (end[1] - start[1]) / (end[0] - start[0]);
      let angle = Math.atan2(
        end[1] - start[1],
        end[0] - start[0]
      );
      let pos = lineGeomentry.vertices.length;
      let dx = width * Math.sin(angle);
      let dy = width * Math.cos(angle);
      console.log(width, angle);
      console.log(dx * dx + dy * dy);
      lineGeomentry.vertices.push(
        new THREE.Vector3().fromArray(
          this.tranToArc([
            start[0] + dx,
            start[1] - dy,
            start[2]
          ])
        )
      );
      lineGeomentry.vertices.push(
        new THREE.Vector3().fromArray(
          this.tranToArc([
            start[0] - dx,
            start[1] + dy,
            start[2]
          ])
        )
      );
      lineGeomentry.vertices.push(
        new THREE.Vector3().fromArray(
          this.tranToArc([end[0] + dx, end[1] - dy, end[2]])
        )
      );
      lineGeomentry.vertices.push(
        new THREE.Vector3().fromArray(
          this.tranToArc([end[0] - dx, end[1] + dy, end[2]])
        )
      );
      lineGeomentry.vertices.push(
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
        new THREE.Face3(pos, pos + 2, pos + 1)
      );
      lineGeomentry.faces.push(
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
      new THREE.LineBasicMaterial({ color: color })
    );
  },

  makeDot(location, color, radius) {
    let geometry = new THREE.CircleBufferGeometry(radius, 32);
    let material = new THREE.MeshBasicMaterial({ color: color });
    let dot = new THREE.Mesh(geometry, material);
    dot.position.fromArray(this.tranToArc(location));
    return dot;
  },
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
};
