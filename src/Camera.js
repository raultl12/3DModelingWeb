import * as THREE from 'three';

import {canvas} from "./Renderer.js";

const camera = new THREE.PerspectiveCamera( 70, canvas.width / canvas.height, 0.01, 1000 );
camera.position.z = 10;

export { camera };