import * as Geometry from "./geometry.js"

let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
let context: CanvasRenderingContext2D = canvas.getContext('2d');

let front: Geometry.Face = new Geometry.Face(
    new Geometry.Vertex(1, 1, 3),
    new Geometry.Vertex(1, -1, 3),
    new Geometry.Vertex(-1, -1, 3),
    new Geometry.Vertex(-1, 1, 3)
    );

let back: Geometry.Face = new Geometry.Face(
    new Geometry.Vertex(1, 1, 4),
    new Geometry.Vertex(1, -1, 4),
    new Geometry.Vertex(-1, -1, 4),
    new Geometry.Vertex(-1, 1, 4)
    );

let bottom: Geometry.Face = new Geometry.Face(
    new Geometry.Vertex(1, 1, 3),
    new Geometry.Vertex(-1, 1, 3),
    new Geometry.Vertex(-1, 1, 4),
    new Geometry.Vertex(1, 1, 4),
    );

let top: Geometry.Face = new Geometry.Face(
    new Geometry.Vertex(1, -1, 3),
    new Geometry.Vertex(-1, -1, 3),
    new Geometry.Vertex(-1, -1, 4),
    new Geometry.Vertex(1, -1, 4),
    );

let shape: Geometry.Shape = new Geometry.Shape(front, back, bottom, top);

let camera: Geometry.Camera = new Geometry.Camera();

setInterval(() => {
    context.clearRect(0, 0, 640, 640);
    shape.draw(camera, context);
    shape.rotate(0, 0, 1, 0.01);
    shape.move(0.001, 0.01, 0.003);
}, 10);