import * as Geometry from "./geometry.js"

let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
let context: CanvasRenderingContext2D = canvas.getContext('2d');

let face: Geometry.Face = new Geometry.Face(
    new Geometry.Vertex(0, 1, 3),
    new Geometry.Vertex(1, -1, 3),
    new Geometry.Vertex(-1, -1, 3)
    );

let camera: Geometry.Camera = new Geometry.Camera();

setInterval(() => {
    context.clearRect(0, 0, 640, 640);
    face.rotate(0, 0, 1, 0.1);
    face.draw(camera, context);
}, 10);