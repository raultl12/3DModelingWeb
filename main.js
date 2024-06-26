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
    updateGroupList,
    generateAnimations,
    updateScenesList,
    sceneToJSON,
    sceneFromJSON,
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
const lightIntensity = document.getElementById('lightIntensity');
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
const groupName = document.getElementById("groupName");
const groupList = document.getElementById("groupList");
const currentGroupLabel = document.getElementsByClassName("currentGroupLabel");
var g = null;
const addToGroup = document.getElementById("addToGroup");
const removeFromGroup = document.getElementById("removeFromGroup");

//Animation zone
const animationActive = document.getElementById("animationActive");
const animationButton = document.getElementById("animation");
const animationZone = document.getElementsByClassName("animationZone")[0];
const animationBack = document.getElementById("animationBack");
const animationLoop = document.getElementById("loopAnimation");

const newAnimation = document.getElementById("newAnimation");
const deleteLastAnimation = document.getElementById("deleteLastAnimation");
const deleteAllAnimations = document.getElementById("deleteAllAnimations");
const animationsBlocks = document.getElementsByClassName("animationBlock");
const clock = new THREE.Clock();

//Database zone
var loggedUser = undefined;
const databaseButton = document.getElementById("database");
const databaseZone = document.getElementsByClassName("databaseZone")[0];
const databaseBack = document.getElementById("databaseBack");
const databaseLogin = document.getElementById("databaseLogin");
const loggedUserLabel = document.getElementById("loggedUser");
const databaseSave = document.getElementById("databaseSave");
let databaseList = document.getElementById("databaseList");
let currentSceneId = null;

//Login
const loginZone = document.getElementById("loginZone");
const loginBack = document.getElementById("loginBack");
const loginForm = document.getElementById("loginForm");

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
/*
document.getElementById("addDirectionalLight").addEventListener("click", () =>{
    currentObject = addDirectionalLight(0xffffff, 30, objects);
    transformControls.attach( currentObject.light );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
});

document.getElementById("addSpotLight").addEventListener("click", () =>{
    currentObject = addSpotLight(0xffffff, 30, objects);
    transformControls.attach( currentObject.light );
    currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
});*/

/******************************************************************************************** */
//Functions for adding textures
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
    document.getElementById("inputFile").value = "";
});

/******************************************************************************************** */
//Functions for sliders
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

lightIntensity.addEventListener('input', () => {
    if(currentObject && currentObject instanceof Light){
        currentObject.setIntensity(lightIntensity.value);
    }
});

transformControls.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
});

/******************************************************************************************** */
//Change the transform type
const transformTypes = ['translate', 'rotate', 'scale'];
var currentTransformType = 1;
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        event.preventDefault();
        transformControls.setMode( transformTypes[currentTransformType] );
        currentTransformType = (currentTransformType + 1) % 3;
    }
});

/******************************************************************************************** */
//Functions for selecting objects
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
            //It is click
            const rect = renderer.domElement.getBoundingClientRect();
        
            mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
            mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
        
            raycaster.setFromCamera( mouse, camera );
        
            const intersects = raycaster.intersectObjects( scene.children);

            for (let i = intersects.length - 1; i >= 0; i--) {
                if (intersects[i].object.name === 'object3D') {
                    for (let j = 0; j < objects.length; j++) {
                        if (objects[j].mesh === intersects[i].object) {
                            currentObject = objects[j];
                            break;
                        }
                    }
                    transformControls.attach( currentObject.mesh );
                    metalnessSlider.value = currentObject.material.metalness;
                    roughnessSlider.value = currentObject.material.roughness;
                    emisiveIntSlider.value = currentObject.material.emissiveIntensity;
                }
                else if (intersects[i].object.name === 'light'){
                    currentObject = objects.find(obj => obj.helper === intersects[i].object);
                    transformControls.attach( currentObject.light );
                    lightIntensity.value = currentObject.light.intensity;
                }
            }
            currObjLabel.textContent = `Current object: ${currentObject.toString()}`;
        }
    }
    dragging = false;
});


/******************************************************************************************** */
//Keyboard events
document.addEventListener('keydown', function(event) {
    if (event.key === '.') {
        if(currentObject){
            CenterObject();
        }
    }

    if (event.key === 't') {
        controlsEnabled = !controlsEnabled;
        transformControls.showX = controlsEnabled;
        transformControls.showY = controlsEnabled;
        transformControls.showZ = controlsEnabled;
    }

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
            objects = objects.filter(obj => obj !== currentObject);
            currentObject = null;
            transformControls.detach(); 
        }
    }

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

    if (event.ctrlKey && event.key === 'c') {
        if(currentObject){
            currentObject = currentObject.clone();
            transformControls.attach( currentObject.mesh );
            objects.push(currentObject);
        }
    }

    if (event.key === '1') {
        if(currentGroup){
            transformControls.attach( currentGroup.group );
            currentObject = currentGroup;
            currObjLabel.textContent = `Current object: ${currentGroup.toString()}`;
        }
    }
});


/******************************************************************************************** */
//Functions for adding HDR background
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
});

function CenterObject(){
    var objectPosition = 
    new THREE.Vector3(currentObject.mesh.position.x, currentObject.mesh.position.y, currentObject.mesh.position.z);
    camera.lookAt(objectPosition);
    controls.target = objectPosition;

    const newDistance = 5;

    camera.position.set(objectPosition.x, objectPosition.y + newDistance, objectPosition.z - newDistance);   
}

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


/******************************************************************************************** */
//Functions for revolution canvas
revDone.addEventListener("click", () =>{
    revCanvas.switchVisibility();
    revZone.style.display = "none";
    document.getElementsByClassName("menu")[0].style.display = "flex";
    const points = revCanvas.getPoints();
    const steps = document.getElementById("revSteps").value;
    currentObject = addObjectRevolution(steps, points, colorPicker.value, objects);
});

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

/******************************************************************************************** */
//Functions for importing and exporting objs

importButton.addEventListener("click", () =>{
    menu.style.display = "none";
    importDownloadZone.style.display = "block";
});

importBack.addEventListener("click", () =>{
    importDownloadZone.style.display = "none";
    menu.style.display = "flex";
});

downloadOBJ.addEventListener("click", () =>{
    if(currentObject && !(currentObject instanceof Light)){
        if(currentObject.toString() === 'group'){
            currentGroup.exportarOBJ();
        }else{
            currentObject.exportarOBJ();
        }
    }
});

downloadSceneOBJ.addEventListener("click", () =>{
    if(currentObject && !(currentObject instanceof Light)){
        exportSceneOBJ(scene);
    }
});

downloadGLTF.addEventListener("click", () =>{
    if(currentObject && !(currentObject instanceof Light)){
        if(currentObject.toString() === 'group'){
            currentGroup.exportarGLTF();
        }else{
            currentObject.exportarGLTF();
        }
    }
});

donwloadSceneGLTF.addEventListener("click", () =>{
    exportSceneGLTF(scene);
});

importOBJ.addEventListener("click", () =>{
    document.getElementById("inputOBJ").click();
});

inputOBJ.addEventListener("change", (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
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

/******************************************************************************************** */
//Functions for groups
groupsButton.addEventListener("click", () =>{
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
        let [selectButton, addToGroup, deleteButton] = updateGroupList(name, groupList, currentGroupLabel);
        for(let label of currentGroupLabel){
            label.textContent = `Current Group: ${name}`;
        }
        selectButton.addEventListener("click", () => {
            g = groups.get(name);
            currentGroup = g;
            transformControls.attach( g.group );
            currentObject = g.group;
            for(let label of currentGroupLabel){
                label.textContent = `Current Group: ${name}`;
            }
        });

        addToGroup.addEventListener("click", () =>{
            let selectedGroup = groups.get(name);
            if(selectedGroup !== g){
                currentGroup.inGroup = true;
                g.add(selectedGroup);
            }
        });

        deleteButton.addEventListener("click", () =>{
            let allLi = groupList.getElementsByTagName("li");
            for(let li of allLi){
                let del = false;
                li.childNodes.forEach((child) => {
                    if(child.value === name){
                        del = true;
                    }
                });
                if(del){
                    groupList.removeChild(li);
                    break;
                }
            }
            groups.delete(name);
            currentGroup = null;
            currentObject = null;
            transformControls.detach();
            for(let label of currentGroupLabel){
                label.textContent = `Current Group: `;
            }
        });

        currObjLabel.textContent = `Current object: ${currentGroup.toString()}`;
        groupName.value = "";
    }
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

/******************************************************************************************** */
//Functions for animations
animationButton.addEventListener("click", () =>{
    menu.style.display = "none";
    animationZone.style.display = "block";
});

animationBack.addEventListener("click", () =>{
    animationZone.style.display = "none";
    menu.style.display = "flex";
});

saveAnimation.addEventListener("click", () =>{
    if(!currentObject || currentObject instanceof Light){
        return;
    }
    let animations = generateAnimations(animationsBlocks);
    currentObject.setAnimationParams(animationActive.checked, animations, animationLoop.checked);
});


newAnimation.addEventListener("click", () =>{
    if(!currentObject || currentObject instanceof Light){
        return;
    }

    let div = document.createElement("div");
    div.className = "animationBlock";

    let rotationLabel = document.createElement("label");
    rotationLabel.textContent = "Rotation: ";
    let inputRotation = document.createElement("input");
    inputRotation.id = "rotation";
    inputRotation.type = "text";
    inputRotation.placeholder = "x, y, z";
    inputRotation.value = currentObject.getRotationStringDegrees();
    rotationLabel.appendChild(inputRotation);

    let translationLabel = document.createElement("label");
    translationLabel.textContent = "Translation: ";
    let inputTranslation = document.createElement("input");
    inputTranslation.id = "translation";
    inputTranslation.type = "text";
    inputTranslation.placeholder = "x, y, z";
    inputTranslation.value = currentObject.getPositionString();
    translationLabel.appendChild(inputTranslation);

    let scaleLabel = document.createElement("label");
    scaleLabel.textContent = "Scale: ";
    let inputScale = document.createElement("input");
    inputScale.id = "scale";
    inputScale.type = "text";
    inputScale.placeholder = "x, y, z";
    inputScale.value = currentObject.getScaleString();
    scaleLabel.appendChild(inputScale);

    let infRotation = document.createElement("label");
    infRotation.textContent = "Infinite rotation: ";

    let inputInfRotation = document.createElement("input");
    inputInfRotation.id = "infRotation";
    inputInfRotation.type = "text";
    inputInfRotation.placeholder = "x, y, z";
    inputInfRotation.value = "0,0,0";
    infRotation.appendChild(inputInfRotation);


    let speedLabel = document.createElement("label");
    speedLabel.textContent = "Speed: ";

    let speed = document.createElement("input");
    speed.id = "speed";
    speed.type = "number";
    speed.placeholder = "Speed";
    speed.value = "1";
    speedLabel.appendChild(speed);

    div.appendChild(rotationLabel);
    div.appendChild(translationLabel);
    div.appendChild(scaleLabel);
    div.appendChild(infRotation);
    div.appendChild(speedLabel);
    document.getElementsByClassName("animation")[0].appendChild(div);
});

deleteLastAnimation.addEventListener("click", () =>{
    let allBlocks = document.getElementsByClassName("animationBlock");
    if(allBlocks.length > 0){
        let lastBlock = allBlocks[allBlocks.length - 1];
        lastBlock.parentNode.removeChild(lastBlock);
    }
});

deleteAllAnimations.addEventListener("click", () =>{
    let allBlocks = document.getElementsByClassName("animationBlock");
    while(allBlocks.length > 0){
        let lastBlock = allBlocks[allBlocks.length - 1];
        lastBlock.parentNode.removeChild(lastBlock);
    }
});

/******************************************************************************************** */
//Functions for database
databaseButton.addEventListener("click", () =>{
    menu.style.display = "none";
    databaseZone.style.display = "block";
    if(loggedUser){
        databaseList.innerHTML = "";
        loggedUserLabel.textContent = `Logged user: ${loggedUser}`;

        fetch("http://localhost:3000/api/scenes", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === "ok"){
                for(let sceneFromDB of data.scenes){
                    let [loadButton, deleteButton, nameInput] = updateScenesList(databaseList, sceneFromDB);

                    loadButton.addEventListener("click", () =>{

                        let parsedContent = JSON.parse(sceneFromDB.content);

                        objects = [];
                        objects = sceneFromJSON(parsedContent);
                        scene.add(transformControls);
                        currentObject = objects[0];
                        transformControls.attach( currentObject.mesh );
                        currentSceneId = sceneFromDB.id;
                    });

                    deleteButton.addEventListener("click", () =>{
                        fetch("http://localhost:3000/api/scenes", {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({id: sceneFromDB.id}),
                            credentials: 'include'
                        })
                        .then(response => response.json())
                        .then(data => {
                            if(data.status === "ok"){
                                databaseList.removeChild(loadButton.parentNode);
                            }
                            else{
                                alert("Error al borrar la escena");
                            }

                        });
                    });

                    nameInput.addEventListener("change", () =>{
                        fetch("http://localhost:3000/api/scenes", {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({id: sceneFromDB.id, name: nameInput.value}),
                            credentials: 'include'
                        })
                        .then(response => response.json())
                        .then(data => {
                            if(data.status === "ok"){
                                alert("Nombre actualizado correctamente");
                            }
                            else{
                                alert("Error al actualizar el nombre");
                            }
                        });
                    });
                }
            }
            else{
                alert("Error al obtener las escenas");
            }
        });
    }
});

databaseBack.addEventListener("click", () =>{
    databaseZone.style.display = "none";
    menu.style.display = "flex";
});

databaseLogin.addEventListener("click", () =>{
    databaseZone.style.display = "none";
    if(!loggedUser){
        loginZone.style.display = "block";
    }
    else{
        loggedUser = undefined;
        loggedUserLabel.textContent = `Logged user: no user`;
        databaseList.innerHTML = "";

        fetch("http://localhost:3000/api/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        menu.style.display = "flex";
    }
});

loginBack.addEventListener("click", () =>{
    loginZone.style.display = "none";
    databaseZone.style.display = "block";
});

loginForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    const formData = new FormData(loginForm);
    const user = formData.get("name");
    const password = formData.get("password");

    if(user && password){
        fetch("http://localhost:3000/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user, password}),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === "ok"){
                loggedUser = user;
                loginZone.style.display = "none";
                databaseZone.style.display = "none";
                menu.style.display = "flex";
                loggedUserLabel.textContent = `Logged user: ${loggedUser}`;
            }
            else{
                alert("Usuario o contraseña incorrectos");
            }
        });
    }
    else{
        alert("Usuario o contraseña incorrectos");
    }
});

databaseSave.addEventListener("click", () =>{
    if(loggedUser){
        let sceneData = sceneToJSON(objects);
        let sceneString = JSON.stringify(sceneData);

        fetch("http://localhost:3000/api/scenes", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({scene: sceneString, id: currentSceneId}),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === "ok"){
                alert("Escena guardada correctamente");
            }
            else{
                alert("Error al guardar la escena");
            }
        });
    }
});