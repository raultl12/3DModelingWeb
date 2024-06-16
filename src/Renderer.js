import * as THREE from 'three';

const canvas = document.getElementById('myCanvas');

const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas} );

renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

export { renderer, canvas };