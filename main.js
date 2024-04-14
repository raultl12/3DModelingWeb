import * as THREE from 'three';
import {scene} from './src/Scene.js';
import {renderer, canvas} from './src/Renderer.js';
import {camera} from './src/Camera.js';

import {Object3D} from './src/objects/Object3D.js';
import {Light} from './src/objects/Light.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import {
    addCube,
    changeColor,
    addSphere,
    addCylinder,
    addPointLight,
    addDirectionalLight,
    addSpotLight,
    MaterialProperty
} from './src/utils.js';

import { RGBELoader } from 'three/examples/jsm/Addons.js';

//Initial setup

const colorPicker = document.getElementById('colorPicker');
const controls = new OrbitControls( camera, canvas );
const transformControls = new TransformControls( camera, renderer.domElement );

const roughnessSlider = document.getElementById('roughness'); 
const metalnessSlider = document.getElementById('metalness');
const emisiveIntSlider = document.getElementById('emisiveInt');
const emisiveColor = document.getElementById('emisiveColor');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let objects = [];
let currentObject = null;
let controlsEnabled = true;
let dragging = false;
let dragStartX = 0;
let dragStartY = 0;

scene.add(transformControls);
const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
scene.add( ambientLight );



animate();

/******************************************************************************************* */
//Functions

function animate() {

	requestAnimationFrame( animate );

	controls.update();
    if(currentObject && currentObject instanceof Object3D){
        transformControls.attach( currentObject.mesh );
        currentObject.line.position.set(currentObject.mesh.position.x, currentObject.mesh.position.y, currentObject.mesh.position.z);
        //Lo mismo para rotacion y escala
        currentObject.line.rotation.set(currentObject.mesh.rotation.x, currentObject.mesh.rotation.y, currentObject.mesh.rotation.z);
        currentObject.line.scale.set(currentObject.mesh.scale.x, currentObject.mesh.scale.y, currentObject.mesh.scale.z);
    }
    else if (currentObject && currentObject instanceof Light){
        transformControls.attach( currentObject.light );
    }
    
	renderer.render( scene, camera );
    
}

/******************************************************************************************* */
//Functions for adding objects

document.getElementById("addCube").addEventListener("click", () =>{
    currentObject = addCube(1, colorPicker.value, objects);
});

document.getElementById("addSphere").addEventListener("click", () =>{
    currentObject = addSphere(1, 32, 16, colorPicker.value, objects);
});

document.getElementById("addCylinder").addEventListener("click", () =>{
    currentObject = addCylinder(1, 1, 2, 32, colorPicker.value, objects);
});
/******************************************************************************************* */

//Functions for adding lights

document.getElementById("addPointLight").addEventListener("click", () =>{
    currentObject = addPointLight(0xffffff, 30, objects);
});

document.getElementById("addDirectionalLight").addEventListener("click", () =>{
    currentObject = addDirectionalLight(0xffffff, 30, objects);
});

document.getElementById("addSpotLight").addEventListener("click", () =>{
    currentObject = addSpotLight(0xffffff, 30, objects);
});

/******************************************************************************************** */
//Funciones para añadir texturas
let type = null;

document.getElementById("addTexture").addEventListener("click", () =>{
    if(currentObject && currentObject instanceof Object3D){
        type = "texture";
        document.getElementById("inputFile").click();
    }
});

document.getElementById("addNormal").addEventListener("click", () =>{
    if(currentObject && currentObject instanceof Object3D){
        type = "normal";
        document.getElementById("inputFile").click();
    }
});

document.getElementById("addRoughness").addEventListener("click", () =>{
    if(currentObject && currentObject instanceof Object3D){
        type = "roughness";
        document.getElementById("inputFile").click();
    }
});

document.getElementById("addMetalness").addEventListener("click", () =>{
    if(currentObject && currentObject instanceof Object3D){
        type = "metalness";
        document.getElementById("inputFile").click();
    }
});

document.getElementById("inputFile").addEventListener("change", (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        const textureLoader = new THREE.TextureLoader();
        const reader = new FileReader();
        reader.onload = function(e) {
            const texture = textureLoader.load(e.target.result);
            currentObject.setTexture(texture, type);
        };
        reader.readAsDataURL(archivo);

    }
    console.log(document.getElementById("inputFile").value);
    document.getElementById("inputFile").value = "";
});

// Funciones de los sliders
colorPicker.addEventListener('input', () => {
	const selectedColor = colorPicker.value;
	changeColor(currentObject, selectedColor);
});

roughnessSlider.addEventListener('input', () => {
    if(currentObject && currentObject instanceof Object3D){
        currentObject.setMaterialProperty(MaterialProperty.ROUGHNESS, roughnessSlider.value);
    }
});

metalnessSlider.addEventListener('input', () => {
    if(currentObject && currentObject instanceof Object3D){
        currentObject.setMaterialProperty(MaterialProperty.METALNESS, metalnessSlider.value);
    }
});

emisiveIntSlider.addEventListener('input', () => {
    if(currentObject && currentObject instanceof Object3D){
        currentObject.setMaterialProperty(MaterialProperty.EMISIVE, emisiveIntSlider.value);
    }
});

emisiveColor.addEventListener('input', () => {
    if(currentObject && currentObject instanceof Object3D){
        currentObject.setEmisiveColor(emisiveColor.value);
    }
});

//Soluciona problema: Al intentar mover el objeto se movia el objeto y la camara
transformControls.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
});

//Al pulsar espacio cambiar entre modos de los transformControls
const transformTypes = ['translate', 'rotate', 'scale'];
var currentTransformType = 1;
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        transformControls.setMode( transformTypes[currentTransformType] );
        currentTransformType = (currentTransformType + 1) % 3;
    }
});

/*BUG-REVISAR: Se selecciona el objeto mas lejano */

canvas.addEventListener('mousedown', (event) => {
    dragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
});

canvas.addEventListener('mouseup', (event) => {
    if (dragging) {
        const dragEndX = event.clientX;
        const dragEndY = event.clientY;
        const deltaX = dragEndX - dragStartX;
        const deltaY = dragEndY - dragStartY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 2) {
            //Se considera click
            const rect = renderer.domElement.getBoundingClientRect();
        
            mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
            mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
        
            raycaster.setFromCamera( mouse, camera );
        
            const intersects = raycaster.intersectObjects( scene.children);
        
            for (let i = intersects.length - 1; i >= 0; i--) {
                if (intersects[i].object.name === 'object3D') {
                    currentObject = objects.find(obj => obj.mesh === intersects[i].object);
                    transformControls.attach( currentObject.mesh );
                }
                else if (intersects[i].object.name === 'light'){
                    currentObject = objects.find(obj => obj.helper === intersects[i].object);
                    transformControls.attach( currentObject.helper );
                }
            }
        }
    }
    dragging = false;
});

document.addEventListener('keydown', function(event) {
    //Al pulsar el . la camara se centra en el currentObject
    if (event.key === '.') {
        if(currentObject){
            CenterObject();
        }
    }

    //Al pulsar tecla T descativar transformControls
    if (event.key === 't') {
        controlsEnabled = !controlsEnabled;
        transformControls.showX = controlsEnabled;
        transformControls.showY = controlsEnabled;
        transformControls.showZ = controlsEnabled;
    }

    //Borrar objeto con supr
    if (event.key === 'Delete') {
        if(currentObject){
            if(currentObject instanceof Light){
                scene.remove(currentObject.helper);
                scene.remove(currentObject.light);
            }
            else if(currentObject instanceof Object3D){
                scene.remove(currentObject.mesh);
                scene.remove(currentObject.line);
            }
            //Eliminar el objeto de la lista de objetos
            objects = objects.filter(obj => obj !== currentObject);
            currentObject = null;
            transformControls.detach(); 
        }
    }

    //Al pulsar L, se activan o desactivan las aristas del objeto actual siempre que sea un objeto3D
    if (event.key === 'l') {
        if(currentObject && currentObject instanceof Object3D){
            if(currentObject.line.visible){
                currentObject.removeEdges();
            }
            else{
                currentObject.addEdges();
            }
        }
    }
});


// Añadir HDR
document.getElementById("addHDR").addEventListener("click", () =>{
    document.getElementById("hdrFile").click();
});

document.getElementById("hdrFile").addEventListener("change", (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const loader = new RGBELoader();
            loader.load(e.target.result, function ( texture ) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;
                scene.environment = texture;
            });
        }
        reader.readAsDataURL(archivo);

    }
    document.getElementById("hdrFile").value = "";
});

/**
 *         const textureLoader = new THREE.TextureLoader();
        const reader = new FileReader();
        reader.onload = function(e) {
            const texture = textureLoader.load(e.target.result);
            currentObject.setTexture(texture, type);
        };
        reader.readAsDataURL(archivo);
 */

function CenterObject(){
    //Primero centrar el objeto en la camara
    var objectPosition = 
    new THREE.Vector3(currentObject.mesh.position.x, currentObject.mesh.position.y, currentObject.mesh.position.z);
    camera.lookAt(objectPosition);
    controls.target = objectPosition;

    //Calcular la distancia entre la camara y el objeto
    const newDistance = 5;

    camera.position.set(objectPosition.x, objectPosition.y + newDistance, objectPosition.z - newDistance);   
}

/* ctrl + d para duplicar objeto
document.addEventListener('keydown', onCopyObject);

function onCopyObject(event) {
    event.preventDefault();
    if ((event.key === "d" || event.key === "D") && (event.ctrlKey || event.metaKey)) {
        objects.push(currentObject.getCopy());
        currentObject = objects[objects.length - 1];
    }
}*/
