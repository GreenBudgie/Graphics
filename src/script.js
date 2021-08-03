import * as Geometry from "./geometry.js";
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let front = new Geometry.Face(new Geometry.Vertex(1, 1, 3), new Geometry.Vertex(1, -1, 3), new Geometry.Vertex(-1, -1, 3), new Geometry.Vertex(-1, 1, 3));
let back = new Geometry.Face(new Geometry.Vertex(1, 1, 4), new Geometry.Vertex(1, -1, 4), new Geometry.Vertex(-1, -1, 4), new Geometry.Vertex(-1, 1, 4));
let bottom = new Geometry.Face(new Geometry.Vertex(1, 1, 3), new Geometry.Vertex(-1, 1, 3), new Geometry.Vertex(-1, 1, 4), new Geometry.Vertex(1, 1, 4));
let top = new Geometry.Face(new Geometry.Vertex(1, -1, 3), new Geometry.Vertex(-1, -1, 3), new Geometry.Vertex(-1, -1, 4), new Geometry.Vertex(1, -1, 4));
let shape = new Geometry.Shape(front, back, bottom, top);
let camera = new Geometry.Camera();
setInterval(() => {
    context.clearRect(0, 0, 640, 640);
    shape.draw(camera, context);
    shape.rotate(0, 0, 1, 0.01);
    shape.move(0.001, 0.01, 0.003);
}, 10);
//# sourceMappingURL=script.js.map