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

    setTexture(texture, type){

        const material = this.mesh.material;
        
        let newMaterial = null;
        
        switch(type){
            case "texture":
                newMaterial = new THREE.MeshStandardMaterial(
                    {
                        color: new THREE.Color(0xffffff),
                        map: texture,
                        normalMap: material.normalMap,
                        roughnessMap: material.roughnessMap,
                        metalnessMap: material.metalnessMap
                    }
                );
                break;
            case "normal":
                newMaterial = new THREE.MeshStandardMaterial(
                    {
                        color: new THREE.Color(0xffffff),
                        map: material.map,
                        normalMap: texture,
                        roughnessMap: material.roughnessMap,
                        metalnessMap: material.metalnessMap
                    }
                );
                break;
            case "roughness":
                newMaterial = new THREE.MeshStandardMaterial(
                    {
                        color: new THREE.Color(0xffffff),
                        map: material.map,
                        normalMap: material.normalMap,
                        roughnessMap: texture,
                        metalnessMap: material.metalnessMap
                    }
                );
                break;
            case "metalness":
                newMaterial = new THREE.MeshStandardMaterial(
                    {
                        color: new THREE.Color(0xffffff),
                        map: material.map,
                        normalMap: material.normalMap,
                        roughnessMap: material.roughnessMap,
                        metalnessMap: texture
                    }
                );
                break;
        }
        this.mesh.material = newMaterial;
        console.log(this.mesh.material);
    }
}

export { Object3D };