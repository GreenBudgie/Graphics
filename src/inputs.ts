import { Camera } from "./geometry.js"

export function initCameraInputs(camera: Camera) {
    let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    document.addEventListener('mousemove', event => {
        if(event.buttons == 1) {
            moveCamera(camera, event.movementX, event.movementY);
        }
        if(event.buttons == 2) {
            rotateCamera(camera, event.movementX, event.movementY);
        }
        if(event.buttons == 3) {
            moveCamera(camera, event.movementX, event.movementY);
            rotateCamera(camera, event.movementX, event.movementY);
        }
    });
    window.oncontextmenu = () => {return false;};
}

function moveCamera(camera: Camera, dx: number, dy: number) {
    let speedFactor = 1 / 250;
    let x = dx * speedFactor;
    let y = -dy * speedFactor;
    let z = 0;
    camera.position.translate(x, y, z);
    camera.target.translate(x, y, z);
}

function rotateCamera(camera: Camera, dx: number, dy: number) {
    let speedFactor = 1 / 200; 
    camera.rotationYaw -= dx * speedFactor;
    camera.rotationPitch -= dy * speedFactor;
}