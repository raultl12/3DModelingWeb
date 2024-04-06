import * as THREE from 'three';
import { Object3D } from './Object3D';


class Cylinder extends Object3D {
    constructor(radiusTop, radiusBottom, height, radialSegments, color) {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const material = new THREE.MeshPhysicalMaterial({ color: color });
        super(geometry, material);
    }
}

export { Cylinder };