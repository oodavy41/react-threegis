import * as THREE from "three";
import * as OBJLoader from "three-obj-loader";
import { threeObj, animateObj } from "./threeObj";
OBJLoader(THREE);

export var TScene = {
  THREE: THREE,
  clock: null,
  view: null,
  arcgisRender: null,
  arcgisReference: null,

  renderer: null,
  camera: null,
  scene: null,

  model: null,
  modelMat: null,
  modelScale: 40,

  models: [],

  init: function(view, render, reference, center, mapSize) {
    this.view = view;
    this.arcgisRender = render;
    this.arcgisReference = reference;
    this.origin = { x: center[0], y: center[1] };
    this.mapSize = mapSize;
  },
  setup: function(context) {
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
      mobj.position = this.tranToArc([
        Math.random() * this.mapSize,
        Math.random() * this.mapSize,
        0
      ]);
      mobj.addAnimi(animateObj.ROT, null, null, null, [
        0,
        0,
        3 * Math.random()
      ]);
      mobj.addAnimi(animateObj.SLE, null, [20, 20, 20], 60);
      mobj.addAnimi(
        animateObj.ROT,
        [Math.PI / 2, 0, 0],
        null,
        30
      );
      mobj.addAnimi(
        animateObj.POS,
        this.tranToArc([
          5000 * Math.random(),
          5000 * Math.random(),
          0
        ]),
        null,
        40
      );

      this.models.push(mobj);
      this.scene.add(mobj.obj);
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
  render: function(context) {
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

  tranToArc: function(renderPos) {
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
  makeOrigin: function() {
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
};
