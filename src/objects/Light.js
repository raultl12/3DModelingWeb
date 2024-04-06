import * as THREE from 'three';
import { scene } from '../Scene';

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
        this.light.color.set(hexColor);
    }
}

export { Light };