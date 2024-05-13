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

        //Animations
        this.animate = false;
        //Rotations
        this.rotX = false;
        this.rotY = false;
        this.rotZ = false;
        this.speedX = 0.01;
        this.speedY = 0.01;
        this.speedZ = 0.01;
    }

    changeColor(hexColor) {
        this.light.color.set(hexColor);
    }

    toString(){
        return this.helper.name;
    }

    setAnimationParams(
        animate,
        rotateX,
        rotateY,
        rotateZ,
        speedX,
        speedY,
        speedZ
    ){
        this.animate = animate;
        this.rotX = rotateX;
        this.rotY = rotateY;
        this.rotZ = rotateZ;
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
    }

    rotateX(angle){
        this.light.rotateX(angle);
    }

    rotateY(angle){
        this.light.rotateY(angle);
    }

    rotateZ(angle){
        this.light.rotateZ(angle);
    }

    update(delta){
        if(this.animate){
            if(this.rotX) this.rotateX(this.speedX * delta);
            if(this.rotY) this.rotateY(this.speedY * delta);
            if(this.rotZ) this.rotateZ(this.speedZ * delta);
        }
    }
}

export { Light };