import * as THREE from 'three';
import {scene} from './src/Scene.js';
import {renderer, canvas} from './src/Renderer.js';
import {camera} from './src/Camera.js';

import {Object3D} from './src/objects/Object3D.js';
import {Light} from './src/objects/Light.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import {DrawingCanvas} from './src/objects/drawingCanvas.js';

import {
    addCube,
    changeColor,
    addSphere,
    addCylinder,
    addPointLight,
    addDirectionalLight,
    addSpotLight,
    MaterialProperty,
    addObjectRevolution,
    exportSceneOBJ,
    exportSceneGLTF,
    updateGroupList
} from './src/utils.js';

import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ObjectGroup } from './src/objects/ObjectGroup.js';


//Initial setup

const colorPicker = document.getElementById('colorPicker');
const controls = new OrbitControls( camera, canvas );
const transformControls = new TransformControls( camera, renderer.domElement );

const roughnessSlider = document.getElementById('roughness'); 
const metalnessSlider = document.getElementById('metalness');
const emisiveIntSlider = document.getElementById('emisiveInt');
const emisiveColor = document.getElementById('emisiveColor');
const menu = document.getElementsByClassName("menu")[0];

//Revolution zone
const revZone = document.getElementsByClassName("revolutionZone")[0];
const revCanvas = new DrawingCanvas();
const revDone = document.getElementById("revolutionDone");
const revClear = document.getElementById("revolutionClear");
const revBack = document.getElementById("back");
const revDivisions = document.getElementById("revDivisions");

//ImportDownload zone
const importButton = document.getElementById("importDownload");
const importDownloadZone = document.getElementsByClassName("importDownloadZone")[0];
const importBack = document.getElementById("importBack");


// Exporting objs
const downloadOBJ = document.getElementById("downloadObj");
const downloadSceneOBJ = document.getElementById("downloadScene");
const downloadGLTF = document.getElementById("downloadGLTF");
const donwloadSceneGLTF = document.getElementById("downloadSceneGLTF");

//Importing objs
const importOBJ = document.getElementById("importOBJ");
const inputOBJ = document.getElementById("inputOBJ");

const importGLTF = document.getElementById("importGLTF");
const inputGLTF = document.getElementById("inputGLTF");

//Groups zone
let groups = new Map();
let currentGroup = null;
const groupsButton = document.getElementById("groups");
const groupZone = document.getElementsByClassName("groupsZone")[0];
const groupsBack = document.getElementById("groupBack");
const addGroup = document.getElementById("addGroup");
const deleteGroup = document.getElementById("deleteGroup");
const groupName = document.getElementById("groupName");
const groupList = document.getElementById("groupList");
const currentGroupLabel = document.getElementById("currentGroupLabel");
var g = null;
const addToGroup = document.getElementById("addToGroup");
const removeFromGroup = document.getElementById("removeFromGroup");

//Animation zone
const animationActive = document.getElementById("animationActive");
const animationButton = document.getElementById("animation");
const animationZone = document.getElementsByClassName("animationZone")[0];
const animationBack = document.getElementById("animationBack");
const rotateX = document.getElementById("rotateX");
const rotateY = document.getElementById("rotateY");
const rotateZ = document.getElementById("rotateZ");
const speedX = document.getElementById("speedX");
const speedY = document.getElementById("speedY");
const speedZ = document.getElementById("speedZ");
const saveAnimation = document.getElementById("saveAnimation");
const clock = new THREE.Clock();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let objects = [];
let currentObject = null;
let controlsEnabled = true;
let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
const currObjLabel = document.getElementById("currentObj");

scene.add(transformControls);
const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
scene.add( ambientLight );

animate();

/******************************************************************************************* */
//Functions

function animate() {
    const delta = clock.getDelta();
    
	requestAnimationFrame( animate );
    
	controls.update();
    if(currentObject){
        for(let i = 0; i < objects.length; i++){
            objects[i].update(delta);
        }
    }

    if(currentGroup){
        //Recorrer todo el mapa de grupos
        for (let group of groups.values()) {
            group.update(delta);
        }
    }

	renderer.render( scene, camera );
    
}

/******************************************************************************************* */
//Functions for adding objects

document.getElementById("addCube").addEventListener("click", () =>{
    currentObject = addCube(1, colorPicker.value, objects);
    transformControls.attach( currentObject.mesh );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
});

document.getElementById("addSphere").addEventListener("click", () =>{
    currentObject = addSphere(1, 32, 16, colorPicker.value, objects);
    transformControls.attach( currentObject.mesh );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
});

document.getElementById("addCylinder").addEventListener("click", () =>{
    currentObject = addCylinder(1, 1, 2, 32, colorPicker.value, objects);
    transformControls.attach( currentObject.mesh );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
});
/******************************************************************************************* */

//Functions for adding lights

document.getElementById("addPointLight").addEventListener("click", () =>{
    currentObject = addPointLight(0xffffff, 30, objects);
    transformControls.attach( currentObject.light );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
});

document.getElementById("addDirectionalLight").addEventListener("click", () =>{
    currentObject = addDirectionalLight(0xffffff, 30, objects);
    transformControls.attach( currentObject.light );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
});

document.getElementById("addSpotLight").addEventListener("click", () =>{
    currentObject = addSpotLight(0xffffff, 30, objects);
    transformControls.attach( currentObject.light );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
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
        event.preventDefault();
        transformControls.setMode( transformTypes[currentTransformType] );
        currentTransformType = (currentTransformType + 1) % 3;
    }
});

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
                    console.log(intersects[i].object);
                    currentObject = objects.find(obj => obj.mesh === intersects[i].object);
                    transformControls.attach( currentObject.mesh );
                }
                else if (intersects[i].object.name === 'light'){
                    currentObject = objects.find(obj => obj.helper === intersects[i].object);
                    transformControls.attach( currentObject.light );
                }
            }
            currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
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
        if(currentObject.inGroup){
            g.remove(currentObject);
            currentObject.inGroup = false;
        }
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

    //Duplicar objeto con Ctrl + C
    if (event.ctrlKey && event.key === 'c') {
        if(currentObject){
            currentObject = currentObject.clone();
            objects.push(currentObject);
        }
    }

    //Al pulsar 1, poner los transform controls al grupo
    if (event.key === '1') {
        if(currentGroup){
            transformControls.attach( currentGroup.group );
            currentObject = currentGroup;
            currObjLabel.textContent = `Current object: ${currentGroup.toString()}`;
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
                console.log(texture);
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;
                scene.environment = texture;
            });
        }
        reader.readAsDataURL(archivo);

    }
});

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

//Funciones para mostrar y ocultar el canvas
document.getElementById("revolution").addEventListener("click", () =>{
    if(revCanvas.getHidden()){
        revCanvas.switchVisibility();
        revZone.style.display = "block";
        document.getElementsByClassName("menu")[0].style.display = "none";
    }
    else{
        revCanvas.switchVisibility();
        revZone.style.display = "none";
    }
});

revDone.addEventListener("click", () =>{
    revCanvas.switchVisibility();
    revZone.style.display = "none";
    document.getElementsByClassName("menu")[0].style.display = "flex";
    const points = revCanvas.getPoints();
    const steps = document.getElementById("revSteps").value;
    currentObject = addObjectRevolution(steps, points, colorPicker.value, objects);
});

//Funciones para el canvas de revolucion
revCanvas.getCanvas().addEventListener("mousedown", (event) => {
    const rect = revCanvas.getCanvas().getBoundingClientRect();
    let x = (event.clientX - rect.left);
    let y = (event.clientY - rect.top);
    revCanvas.addPoint(x, y);
});

revClear.addEventListener("click", () =>{
    revCanvas.clear();
});

revBack.addEventListener("click", () =>{
    revCanvas.switchVisibility();
    revZone.style.display = "none";
    menu.style.display = "flex";
});

revDivisions.addEventListener("input", () =>{
    revCanvas.setDivisions(revDivisions.value);
});

//ImportDownloadZone

importButton.addEventListener("click", () =>{
    menu.style.display = "none";
    importDownloadZone.style.display = "block";
});

importBack.addEventListener("click", () =>{
    importDownloadZone.style.display = "none";
    menu.style.display = "flex";
});

// Exporting objs
downloadOBJ.addEventListener("click", () =>{
    if(currentObject && currentObject instanceof Object3D){
        currentObject.exportarOBJ();
    }
});

downloadSceneOBJ.addEventListener("click", () =>{
    if(currentObject && currentObject instanceof Object3D){
        exportSceneOBJ(scene);
    }
});

downloadGLTF.addEventListener("click", () =>{
    if(currentObject && currentObject instanceof Object3D){
        currentObject.exportarGLTF();
    }
});

donwloadSceneGLTF.addEventListener("click", () =>{
    exportSceneGLTF(scene);
});

// Importing objs
importOBJ.addEventListener("click", () =>{
    document.getElementById("inputOBJ").click();
});

inputOBJ.addEventListener("change", (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        // instantiate a loader
        const loader = new OBJLoader();

        const reader = new FileReader();

        reader.onload = function(e) {
            loader.load(e.target.result, function ( group ) {
                for(let i = 0; i < group.children.length; i++){
                    let mesh = group.children[i].clone();
                    let material = new THREE.MeshStandardMaterial({color: 0x00ff00});
                    let geometry = mesh.geometry.clone();
                    geometry.scale(10, 10, 10);
                    geometry.computeVertexNormals();
                    let obj = new Object3D(geometry, material);
                    objects.push(obj);
                    currentObject = obj;
                }
            });
        }
        reader.readAsDataURL(archivo);
        inputOBJ.value = "";
    }
});


importGLTF.addEventListener("click", () =>{
    document.getElementById("inputGLTF").click();
});

inputGLTF.addEventListener("change", (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        // instantiate a loader
        const loader = new GLTFLoader();

        const reader = new FileReader();

        reader.onload = function(e) {
            loader.load(e.target.result, function ( gltf ) {
                let mesh = gltf.scene.children[0].clone();
                let material = new THREE.MeshStandardMaterial({color: 0x00ff00});
                let geometry = mesh.geometry.clone();
                geometry.computeVertexNormals();
                let obj = new Object3D(geometry, material);
                objects.push(obj);
                currentObject = obj;
            });
        }
        reader.readAsDataURL(archivo);

        inputGLTF.value = "";

    }
});

//Groups
groupsButton.addEventListener("click", () =>{
    console.log("click");
    menu.style.display = "none";
    groupZone.style.display = "block";
});

groupsBack.addEventListener("click", () =>{
    groupZone.style.display = "none";
    menu.style.display = "flex";
});

addGroup.addEventListener("click", () =>{
    if(groupName.value !== ""){
        let name = groupName.value;
        g = new ObjectGroup();
        groups.set(name, g);
        currentGroup = g;
        transformControls.attach( g.group );
        currentObject = g.group;
        let [selectButton, addToGroup] = updateGroupList(name, groupList, currentGroupLabel);
        selectButton.addEventListener("click", () => {
            g = groups.get(name);
            currentGroup = g;
            transformControls.attach( g.group );
            currentObject = g.group;
            currentGroupLabel.textContent = `Current Group: ${name}`;
        });

        addToGroup.addEventListener("click", () =>{
            let selectedGroup = groups.get(name);
            currentGroup.inGroup = true;
            g.add(selectedGroup);
        });

        currObjLabel.textContent = `Current object: ${currentGroup.toString()}`;
        groupName.value = "";
    }
});

deleteGroup.addEventListener("click", () =>{
    console.log("Delete Group");
});

addToGroup.addEventListener("click", () =>{
    if(g !== null && currentGroup && (currentObject instanceof Object3D || currentObject instanceof Light)){
        currentObject.inGroup = true;
        g.add(currentObject);
    }
});

removeFromGroup.addEventListener("click", () =>{
    if(g !== null && currentGroup && (currentObject instanceof Object3D || currentObject instanceof Light)){
        g.remove(currentObject);
        currentObject.inGroup = false;
    }
});

//Animation
animationButton.addEventListener("click", () =>{
    menu.style.display = "none";
    animationZone.style.display = "block";
});

animationBack.addEventListener("click", () =>{
    animationZone.style.display = "none";
    menu.style.display = "flex";
});

saveAnimation.addEventListener("click", () =>{
    currentObject.setAnimationParams(
        animationActive.checked,
        rotateX.checked,
        rotateY.checked,
        rotateZ.checked,
        speedX.value,
        speedY.value,
        speedZ.value
    );
});