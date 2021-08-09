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
    window.oncontextmenu = () => { return false; };
}
function moveCamera(camera, dx, dy) {
    let speedFactor = 1 / 250;
    let x = dx * speedFactor;
    let y = -dy * speedFactor;
    let z = 0;
    camera.position.translate(x, y, z);
    camera.target.translate(x, y, z);
}
function rotateCamera(camera, dx, dy) {
    let speedFactor = 1 / 200;
    camera.rotationYaw -= dx * speedFactor;
    camera.rotationPitch -= dy * speedFactor;
}
//# sourceMappingURL=inputs.js.map