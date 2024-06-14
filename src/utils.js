import { Cube } from './objects/Cube';
import {Sphere} from './objects/Sphere';
import { Cylinder } from './objects/Cylinder';
import { Light } from './objects/Light';
import { ObjectRevolution } from './objects/ObjectRevolution';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { Object3D } from './objects/Object3D';
import { ObjectGroup } from './objects/ObjectGroup';
import * as THREE from 'three';
import { scene } from './Scene';
import { camera } from './Camera';
import { renderer } from './Renderer';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

function addCube(size, color, objects){
    let cube = new Cube(size, color);
    objects.push(cube);
    return cube;
}

function addSphere(radius, widthSegments, heightSegments, color, objects){
    let sphere = new Sphere(radius, widthSegments, heightSegments, color);
    objects.push(sphere);
    return sphere;

}

function addCylinder(radiusTop, radiusBottom, height, radialSegments, color, objects){
    let cylinder = new Cylinder(radiusTop, radiusBottom, height, radialSegments, color);
    objects.push(cylinder);
    return cylinder;

}

function addObjectRevolution(steps, points, color, objects){
    let revolution = new ObjectRevolution(steps, points, color, objects);
    objects.push(revolution);
    return revolution;
}


function changeColor(object, hexColor){
    object.changeColor(hexColor);
}

//Lights
const LightType = {
    POINT: 1,
    DIRECTIONAL: 2,
    SPOT: 3,
};

function addPointLight(color, intensity, objects){
    let light = new Light(color, intensity);
    objects.push(light);
    return light;
}

function addDirectionalLight(color, intensity, objects){
    let light = new Light(color, intensity, LightType.DIRECTIONAL);
    objects.push(light);
    return light;
}

function addSpotLight(color, intensity, objects){
    let light = new Light(color, intensity, LightType.SPOT);
    objects.push(light);
    return light;
}

// Material properties
const MaterialProperty = {
    ROUGHNESS: 1,
    METALNESS: 2,
    EMISIVE: 3,
};

//Exportar la escena
function exportSceneOBJ(s){
    // Crear un objeto Blob con el contenido en formato .obj
    const exporter = new OBJExporter();
    var group = new THREE.Group();
    //Obtener en un array todos los objetos de la escena
    for(let i = 0; i < s.children.length; i++){
        if((s.children[i].name == "object3D") || (s.children[i].name == "group")){
            group.add(s.children[i].clone());
        }
    }

    var result = exporter.parse(group);

    var archivoBlob = new Blob([result], { type: "text/plain" });

    // Crear un objeto URL para el Blob
    var urlArchivo = URL.createObjectURL(archivoBlob);

    // Crear un elemento <a> invisible
    var linkDescarga = document.createElement("a");
    linkDescarga.href = urlArchivo;
    linkDescarga.download = "scene.obj"; // Nombre del archivo
    document.body.appendChild(linkDescarga);

    // Simular un clic en el enlace para iniciar la descarga
    linkDescarga.click();

    // Eliminar el enlace después de la descarga
    document.body.removeChild(linkDescarga);
}

function exportSceneGLTF(s){
    const exporter = new GLTFExporter();

    var group = new THREE.Group();
    //Obtener en un array todos los objetos de la escena
    for(let i = 0; i < s.children.length; i++){
        if((s.children[i].name == "object3D") || (s.children[i].name == "group")){
            group.add(s.children[i].clone());
        }
    }

    exporter.parse(group, function (result) {
        var output = JSON.stringify(result, null, 2);
        var blob = new Blob([output], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        link.href = url;
        link.download = 'scene.gltf';
        link.click();
        document.body.removeChild(link);
    });
}

function updateGroupList(name, list, currentGroupLabel){
    let li = document.createElement("li");
    currentGroupLabel.textContent = `Current Group: ${name}`;

    let button = document.createElement("button");
    button.textContent = "Select";
    button.id = "selectButton";
    button.value = name;

    li.textContent = name;

    li.appendChild(button);

    let addButton = document.createElement("button")
    addButton.textContent = "Add to current group";
    addButton.id = "addGtoG";
    addButton.value = name;
    li.appendChild(addButton);

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.id = "deleteButton";
    deleteButton.value = name;
    li.appendChild(deleteButton);

    list.appendChild(li);

    return [button, addButton, deleteButton];
}

function generateAnimations(animationsList){
    let animations = [];

    let textRotation = undefined;
    let textTranslation = undefined;
    let textScale = undefined;
    let textInfRotation = undefined;

    let vectorRotation = new THREE.Vector3();
    let vectorTranslation = new THREE.Vector3();
    let vectorScale = new THREE.Vector3();
    let vectorInfRotation = new THREE.Vector3();
    
    for(let animation of animationsList){
        textRotation = animation.querySelector('input[id="rotation"]');
        textTranslation = animation.querySelector('input[id="translation"]');
        textScale = animation.querySelector('input[id="scale"]');
        textInfRotation = animation.querySelector('input[id="infRotation"]');

        vectorRotation = textRotation.value.split(",");
        vectorTranslation = textTranslation.value.split(",");
        vectorScale = textScale.value.split(",");
        vectorInfRotation = textInfRotation.value.split(",");

        let a = {
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(vectorRotation[0]), THREE.MathUtils.degToRad(vectorRotation[1]), THREE.MathUtils.degToRad(vectorRotation[2])),
            translation: new THREE.Vector3(parseFloat(vectorTranslation[0]), parseFloat(vectorTranslation[1]), parseFloat(vectorTranslation[2])),
            scale: new THREE.Vector3(parseFloat(vectorScale[0]), parseFloat(vectorScale[1]), parseFloat(vectorScale[2])),
            infiniteRotation: new THREE.Vector3(parseFloat(vectorInfRotation[0]), parseFloat(vectorInfRotation[1]), parseFloat(vectorInfRotation[2])).normalize(),
            speed: parseFloat(animation.querySelector('input[id="speed"]').value),
        };
        console.log(a);
        animations.push(a);
    }

    return animations;
}

function updateScenesList(scenesList, scene){
    let li = document.createElement("li");

    //Input hidden con el id de la escena
    let inputId = document.createElement("input");
    inputId.type = "hidden";
    inputId.name = "sceneId";
    inputId.id = "sceneId";
    inputId.value = scene.id;
    
    let input = document.createElement("input");
    input.type = "text";
    input.name = "databaseName";
    input.id = "databaseName";
    input.value = scene.name;

    let loadButton = document.createElement("button");
    loadButton.id = "loadScene";
    loadButton.textContent = "Load";

    let deleteButton = document.createElement("button");
    deleteButton.id = "deleteScene";
    deleteButton.textContent = "Delete";

    li.appendChild(inputId);
    li.appendChild(input);
    li.appendChild(loadButton);
    li.appendChild(deleteButton);

    scenesList.appendChild(li);

    return [loadButton, deleteButton];
}

function sceneToJSON(objs){
    let objects = [];
    let lights = [];

    for(let i = 0; i < objs.length; i++){
        let child = objs[i];
        if(child instanceof Object3D){
            objects.push(child.toJSON());
        }
        else if(child instanceof Light){
            lights.push(child.toJSON());
        }
    }

    let json = {
        objects: objects,
        lights: lights,
    };

    return json;
}

function sceneFromJSON(json, sceneObjects){
    clearScene();
    let objects = json.objects;
    let lights = json.lights;
    let obj = undefined;
    let light = undefined;

    for(let i = 0; i < objects.length; i++){
        
        switch(objects[i].geometryType){
            case "BoxGeometry":
                obj = new Cube(1, objects[i].color);
                break;
            case "SphereGeometry":
                obj = new Sphere(1, 32, 16, objects[i].color);
                break;
            case "CylinderGeometry":
                obj = new Cylinder(1, 1, 2, 32, objects[i].color);
                break;
        }

        obj.mesh.position.set(objects[i].position.x, objects[i].position.y, objects[i].position.z);
        obj.mesh.rotation.set(objects[i].rotation.x, objects[i].rotation.y, objects[i].rotation.z);
        obj.mesh.scale.set(objects[i].scale.x, objects[i].scale.y, objects[i].scale.z);
        obj.mesh.material.color.set(objects[i].color);

        sceneObjects.push(obj);
    }

    for(let i = 0; i < lights.length; i++){

        switch(lights[i].type){
            case LightType.POINT:
                light = new Light(lights[i].color, lights[i].intensity);
                break;
            case LightType.DIRECTIONAL:
                light = new Light(lights[i].color, lights[i].intensity, LightType.DIRECTIONAL);
                break;
            case LightType.SPOT:
                light = new Light(lights[i].color, lights[i].intensity, LightType.SPOT);
                break;
            default:
                light = new Light(lights[i].color, lights[i].intensity);
                break;
        }

        light.light.position.set(lights[i].position.x, lights[i].position.y, lights[i].position.z);
        sceneObjects.push(light);
    }
}

function clearScene(){
    scene.clear();
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
    
    const gridHelper = new THREE.GridHelper( 1000, 1000 );
    scene.add( gridHelper );

    const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
    scene.add( ambientLight );
}

export {
    addCube,
    changeColor,
    addSphere,
    addCylinder,
    addPointLight,
    addDirectionalLight,
    addSpotLight, LightType,
    MaterialProperty,
    addObjectRevolution,
    exportSceneOBJ,
    exportSceneGLTF,
    updateGroupList,
    generateAnimations,
    updateScenesList,
    sceneToJSON,
    sceneFromJSON,
};
    