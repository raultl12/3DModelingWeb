import * as THREE from 'three';
import { Object3D } from './Object3D';
import { scene } from '../Scene';
import { Cube } from './Cube';
import { Sphere } from './Sphere';


class ObjectGroup{
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'group';

        scene.add(this.group);
    }

    add(object){
        this.group.add(object.mesh);
        this.group.add(object.line);
    }

    remove(object){
        this.group.remove(object.mesh);
        this.group.remove(object.line);
    }
}

export { ObjectGroup };