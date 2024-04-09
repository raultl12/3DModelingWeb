import * as THREE from 'three';
import { scene } from '../Scene';

class Object3D {
    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = "object3D";
        scene.add(this.mesh);

        this.edges = new THREE.EdgesGeometry( geometry ); 
        this.line = new THREE.LineSegments(this.edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); 
        scene.add( this.line );
    }

    changeColor(hexColor) {
        this.mesh.material.color.set(hexColor);
    }

    removeEdges(){
        this.line.visible = false;
    }

    addEdges(){
        this.line.visible = true;
    }
}

export { Object3D };