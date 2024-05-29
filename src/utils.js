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

/*
function getTranslations(translationLines){
    let translations = [];
    let t;
    for(let line of translationLines){
        let from = line.querySelectorAll('input[placeholder="x, y, z"]')[0].value;
        let to = line.querySelectorAll('input[placeholder="x, y, z"]')[1].value;
        let speed = line.querySelector('input[type="number"]').value;
        
        let v_from = from.split(",");    
        let v_to = to.split(",");
        t = {
            from: new THREE.Vector3(v_from[0], v_from[1], v_from[2]),
            to: new THREE.Vector3(v_to[0], v_to[1], v_to[2]),
            speed: speed,
        };

        translations.push(t);
    }

    return translations;
}

function getScales(scaleLines){
    let scales = [];
    let s;
    for(let line of scaleLines){
        let axis = line.querySelector('select').value;
        let factor = line.querySelector('input[type="number"]').value;
        s = {
            axis: axis,
            factor: parseFloat(factor),
        };

        scales.push(s);
    }

    return scales;
}*/

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
    generateAnimations
};
    