import { Cube } from './objects/Cube';
import {Sphere} from './objects/Sphere';
import { Cylinder } from './objects/Cylinder';
import { Light } from './objects/Light';

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

export {
    addCube,
    changeColor,
    addSphere,
    addCylinder,
    addPointLight,
    addDirectionalLight,
    addSpotLight, LightType,
    MaterialProperty
};
    