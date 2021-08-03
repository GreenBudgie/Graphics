import * as Geometry from "./geometry.js";
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let face = new Geometry.Face(new Geometry.Vertex(1, 1, 4), new Geometry.Vertex(1, -1, 4), new Geometry.Vertex(-1, -1, 3), new Geometry.Vertex(-1, 1, 3));
let camera = new Geometry.Camera();
//setInterval(() => {
context.clearRect(0, 0, 640, 640);
face.draw(camera, context);
//}, 10);
//# sourceMappingURL=script.js.map