import { Vertex, ShapeBuilder, Camera } from "./geometry.js";
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let cubeBuilder = new ShapeBuilder;
let cube = cubeBuilder.defineVertices(new Vertex(1, 1, 1), new Vertex(1, -1, 1), new Vertex(-1, -1, 1), new Vertex(-1, 1, 1), new Vertex(1, 1, -1), new Vertex(1, -1, -1), new Vertex(-1, -1, -1), new Vertex(-1, 1, -1))
    .defineFaces(0, 1, 2, 3)
    .defineFaces(0, 1, 5, 4)
    .defineFaces(4, 5, 6, 7)
    .defineFaces(3, 2, 6, 7)
    .defineFaces(0, 3, 7, 4)
    .defineFaces(1, 2, 6, 5)
    .build();
let cube2 = cube.clone();
cube.move(-0.8, 0, 4);
cube2.move(1.2, 0.5, 7);
let camera = new Camera();
setInterval(() => {
    context.clearRect(0, 0, 640, 640);
    cube.draw(camera, context);
    cube2.draw(camera, context);
}, 15);
//# sourceMappingURL=script.js.map