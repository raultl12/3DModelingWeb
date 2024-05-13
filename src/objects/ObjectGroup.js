import * as THREE from 'three';
import { scene } from '../Scene';


class ObjectGroup{
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'group';

        scene.add(this.group);

        this.animate = false;
        //Rotations
        this.rotX = false;
        this.rotY = false;
        this.rotZ = false;
        this.speedX = 0.01;
        this.speedY = 0.01;
        this.speedZ = 0.01;
    }

    add(object){
        if(object.mesh === undefined){
            this.group.attach(object.light);
        }
        else{
            this.group.attach(object.mesh);
        }
    }

    remove(object){
        let pos = new THREE.Vector3();
        if(object.mesh === undefined){
            object.light.getWorldPosition(pos);
            object.light.position.set(pos.x, pos.y, pos.z);
            scene.add(object.light);
            this.group.remove(object.light);
        }
        else{
            object.mesh.getWorldPosition(pos)
            object.mesh.position.set(pos.x, pos.y, pos.z);
            scene.add(object.mesh);
            this.group.remove(object.mesh);
        }
    }

    toString(){
        return this.group.name;
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
        this.group.rotateX(angle);
    }

    rotateY(angle){
        this.group.rotateY(angle);
    }

    rotateZ(angle){
        this.group.rotateZ(angle);
    }

    update(delta){
        if(this.animate){
            if(this.rotX) this.rotateX(this.speedX * delta);
            if(this.rotY) this.rotateY(this.speedY * delta);
            if(this.rotZ) this.rotateZ(this.speedZ * delta);
        }
    }
}

export { ObjectGroup };