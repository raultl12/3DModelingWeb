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

        this.translations = [];
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

    setAnimationParams(
        animate,
        rotateX,
        rotateY,
        rotateZ,
        speedX,
        speedY,
        speedZ,
        translations
    ){
        this.animate = animate;
        this.rotX = rotateX;
        this.rotY = rotateY;
        this.rotZ = rotateZ;
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
        this.translations = translations;
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

            if(this.translations.length != 0){
                let axis = new THREE.Vector3();
                axis.subVectors(this.translations[0].to, this.translations[0].from);
                let axisNormalized = axis.normalize();
    
                //Translate
                this.light.translateOnAxis(axisNormalized, this.translations[0].speed * delta);
    
                //Check if translation is finished
                if(this.light.position.distanceTo(this.translations[0].to) < 0.1){
                    if(document.getElementById("loopTranslations").checked){
                        this.translations.push(this.translations[0]);
                    }
                    this.translations.shift();
                }
            }
        }
    }
}

export { Light };