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
function addPointLight(color, intensity, objects){
    let light = new Light(color, intensity);
    objects.push(light);
    return light;
}

export {addCube, changeColor, addSphere, addCylinder, addPointLight};