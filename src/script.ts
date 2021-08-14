import { Vertex, Face, Shape, ShapeBuilder, Camera } from "./geometry.js"
import * as Inputs from "./inputs.js"

let camera: Camera = new Camera();
Inputs.initCameraInputs(camera);

let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
let context: CanvasRenderingContext2D = canvas.getContext('2d');

let cubeBuilder: ShapeBuilder = new ShapeBuilder;
let cube: Shape = cubeBuilder.defineVertices(
    new Vertex(1, 1, 1),
    new Vertex(1, -1, 1),
    new Vertex(-1, -1, 1),
    new Vertex(-1, 1, 1),
    new Vertex(1, 1, -1),
    new Vertex(1, -1, -1),
    new Vertex(-1, -1, -1),
    new Vertex(-1, 1, -1),
)
.defineFaces(0, 1, 2, 3)
.defineFaces(0, 1, 5, 4)
.defineFaces(4, 5, 6, 7)
.defineFaces(3, 2, 6, 7)
.defineFaces(0, 3, 7, 4)
.defineFaces(1, 2, 6, 5)
.build();

cube.translate(0, 0, 4);

setInterval(() => {
    context.clearRect(0, 0, 640, 640);
    cube.draw(camera, context);
}, 15);