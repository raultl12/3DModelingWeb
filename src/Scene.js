import * as THREE from 'three';


const scene = new THREE.Scene();

scene.background = new THREE.Color( 0x000000 );
const backgroundColor = document.getElementById('backgroundColor');
backgroundColor.value = '#000000';
backgroundColor.addEventListener('change', () => {
    scene.background = new THREE.Color(backgroundColor.value);
});




const gridHelper = new THREE.GridHelper( 1000, 1000 );

//Add objects to the scene
scene.add( gridHelper );


export { scene };