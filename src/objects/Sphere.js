import * as THREE from 'three';
import { Object3D } from './Object3D';


class Sphere extends Object3D {
    constructor(radius, widthSegments, heightSegments, color) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshStandardMaterial({ color: color });
        super(geometry, material);
    }
}

export { Sphere };