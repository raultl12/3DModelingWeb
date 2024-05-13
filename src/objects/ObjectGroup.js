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