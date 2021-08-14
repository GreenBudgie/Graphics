export function initCameraInputs(camera) {
    let canvas = document.getElementById('canvas');
    document.addEventListener('mousemove', event => {
        if (event.buttons == 1) {
            moveCamera(camera, event.movementX, event.movementY);
        }
        if (event.buttons == 2) {
            rotateCamera(camera, event.movementX, event.movementY);
        }
        if (event.buttons == 3) {
            moveCamera(camera, event.movementX, event.movementY);
            rotateCamera(camera, event.movementX, event.movementY);
        }
    });
    document.addEventListener('wheel', event => {
        zoomCamera(camera, Math.sign(event.deltaY));
    });
    window.oncontextmenu = () => { return false; };
}
function moveCamera(camera, dx, dy) {
    let speedFactor = 1 / 250;
    let x = dx * speedFactor;
    let y = -dy * speedFactor;
    camera.position.translate(x, y, 0);
    camera.target.translate(x, y, 0);
}
function zoomCamera(camera, zoom) {
    let zoomFactor = camera.position.distance(camera.target) * 0.1;
    //camera.position.translate(0, 0, -zoom * zoomFactor * Math.cos(camera.rotationYaw));
}
function rotateCamera(camera, dx, dy) {
    let speedFactor = 1 / 200;
    camera.rotationHorizontal += dx * speedFactor;
    camera.rotationVertical += dy * speedFactor;
    //camera.rotateAroundTarget(dx * speedFactor, dy * speedFactor);
}
//# sourceMappingURL=inputs.js.map