import * as THREE from 'three';
import { scene } from '../Scene';
import { LightType } from '../utils';

class Light {
    constructor(color, intensity, type) {

        this.type = type;

        switch (this.type) {
            case LightType.POINT:
                this.light = new THREE.PointLight(color, intensity);
                this.helper = new THREE.PointLightHelper( this.light, 1 );
                
                break;
            case LightType.DIRECTIONAL:
                this.light = new THREE.DirectionalLight(color, intensity);
                this.helper = new THREE.DirectionalLightHelper( this.light, 5 );

                
                break;
            case LightType.SPOT:
                this.light = new THREE.SpotLight(color, intensity);
                this.helper = new THREE.SpotLightHelper( this.light );

                
                break;
            default:
                this.light = new THREE.PointLight(color, intensity);
                this.helper = new THREE.PointLightHelper( this.light, 1 );
                
                break;
        }
        
        this.light.position.set(0, 0, 0);
        
        this.helper.name = "light";
        scene.add(this.helper);

        scene.add(this.light);
    }

    changeColor(hexColor) {
        this.light.color.set(hexColor);
    }
}

export { Light };