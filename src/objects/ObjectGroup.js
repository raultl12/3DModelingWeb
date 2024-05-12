import * as THREE from 'three';
import { scene } from '../Scene';


class ObjectGroup{
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'group';

        scene.add(this.group);
    }

    add(object){
        if(object.mesh === undefined){
            this.group.add(object.light);
        }
        else{
            this.group.add(object.mesh);
        }
    }

    remove(object){
        if(object.mesh === undefined){
            this.group.remove(object.light);
        }
        else{
            this.group.remove(object.mesh);
        }
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
}

export { ObjectGroup };