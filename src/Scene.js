import * as THREE from 'three';


const scene = new THREE.Scene();

scene.background = new THREE.Color( 0x000000 );
const backgroundColor = document.getElementById('backgroundColor');
backgroundColor.value = '#000000';
backgroundColor.addEventListener('change', () => {
    scene.background = new THREE.Color(backgroundColor.value);
});


const axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

const gridHelper = new THREE.GridHelper( 1000, 1000 );

scene.add( gridHelper );

document.addEventListener('keydown', function(event){
    if(event.key === 'h'){
        gridHelper.visible = !gridHelper.visible;
    }

    if(event.key === 'a'){
        axesHelper.visible = !axesHelper.visible;
    }
});


export { scene };