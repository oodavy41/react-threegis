export function tranToArc(scene, renderPos) {
  let pos = [
    renderPos[0] + scene.origin.x,
    renderPos[1] + scene.origin.y,
    renderPos[2]
  ];
  scene.arcgisRender.toRenderCoordinates(
    scene.view,
    pos,
    0,
    scene.arcgisReference.WebMercator,
    pos,
    0,
    1
  );
  return pos;
}
