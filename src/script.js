import * as Geometry from "./geometry.js";
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let vertices = [
    new Geometry.Vertex(2, 2, 3),
    new Geometry.Vertex(2, 1, 3),
    new Geometry.Vertex(1, 1, 3),
    new Geometry.Vertex(1, 2, 3),
];
let camera = new Geometry.Camera();
context.clearRect(0, 0, 640, 640);
let projections = [];
vertices.forEach(vertex => {
    projections.push(camera.getVertexProjection(vertex));
});
context.beginPath();
context.moveTo(projections[0].x, projections[0].y);
context.lineTo(projections[1].x, projections[1].y);
context.lineTo(projections[2].x, projections[2].y);
context.lineTo(projections[3].x, projections[3].y);
context.closePath();
context.stroke();
//# sourceMappingURL=script.js.map