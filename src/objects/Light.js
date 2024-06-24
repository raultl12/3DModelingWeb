import * as THREE from 'three';
import { scene } from '../Scene';
import { LightType } from '../utils';

class Light {
    constructor(color, intensity) {
        this.type = LightType.POINT;
        this.light = new THREE.PointLight(color, intensity);
        this.helper = new THREE.PointLightHelper( this.light, 1 );
        /*
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
        }*/
        
        this.light.position.set(0, 0, 0);
        
        this.helper.name = "light";
        scene.add(this.helper);

        scene.add(this.light);
    }

    changeColor(hexColor) {
        this.light.color.set(hexColor);
    }

    setIntensity(intensity){
        this.light.intensity = intensity;
    }

    toString(){
        return this.helper.name;
    }

    update(delta){}

    toJSON(){
        return {
            type: this.type,
            color: this.light.color,
            intensity: this.light.intensity,
            position: this.light.position,
        }
    }
}

export { Light };