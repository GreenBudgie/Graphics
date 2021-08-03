import * as Geometry from "./geometry.js"

let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
let context: CanvasRenderingContext2D = canvas.getContext('2d');

let vertices: Geometry.Vertex[] = [
    new Geometry.Vertex(2, 2, 3),
    new Geometry.Vertex(2, 1, 3),
    new Geometry.Vertex(1, 1, 3),
    new Geometry.Vertex(1, 2, 3),
]

let camera: Geometry.Camera = new Geometry.Camera();

context.clearRect(0, 0, 640, 640);

let projections: {x: number, y: number}[] = [];
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
