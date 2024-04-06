import * as THREE from 'three';
import { scene } from '../Scene';

/*
Clase generica para crear luces
La idea es crear un enum con los tipos de luces que se pueden crear
Si la luz es point, añadirle un circulo, si es direccional añadirle una flecha, etc
debe de tener una mesh para que se pueda seleccionar y mover como un objeto 3D
*/

class Light {
    constructor(color, intensity) {

        //Crear una luz
        this.light = new THREE.PointLight(color, intensity);
        this.light.position.set(0, 0, 0);
        
        const sphereSize = 1;
        this.helper = new THREE.PointLightHelper( this.light, sphereSize );
        this.helper.name = "light";
        scene.add( this.helper );

        scene.add(this.light);
    }

    changeColor(hexColor) {
        this.mesh.material.color.set(hexColor);
    }
}

export { Light };