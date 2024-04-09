import * as THREE from 'three';
import { Object3D } from './Object3D';


class Cube extends Object3D {
    constructor(size, color) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        const material = new THREE.MeshStandardMaterial({ color: color});
        super(geometry, material);
    }
}

export { Cube };