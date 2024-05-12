import * as THREE from 'three';
import { scene } from '../Scene';


class ObjectGroup{
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'group';

        scene.add(this.group);
    }

    add(object){
        this.group.add(object.mesh);
    }

    remove(object){
        this.group.remove(object.mesh);
    }
}

export { ObjectGroup };