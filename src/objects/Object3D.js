import * as THREE from 'three';
import { scene } from '../Scene';
import { MaterialProperty } from '../utils';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

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

        switch(type){
            case "texture":
                this.mesh.material.map = texture;
                this.mesh.material.color = new THREE.Color(0xffffff);
                break;
            case "normal":
                this.mesh.material.normalMap = texture;
                break;
            case "roughness":
                this.mesh.material.roughnessMap = texture;
                break;
            case "metalness":
                this.mesh.material.metalnessMap = texture;
                break;
        }

        this.mesh.material.needsUpdate = true;
        console.log(this.mesh.material);
    }


    setMaterialProperty(property, value){
        switch(property){
            case MaterialProperty.ROUGHNESS:
                this.mesh.material.roughness = value;
                break;
            case MaterialProperty.METALNESS:
                this.mesh.material.metalness = value;
                break;
            case MaterialProperty.EMISIVE:
                this.mesh.material.emissiveIntensity = value;
                break;
        }
        this.mesh.material.needsUpdate = true;
    }

    setEmisiveColor(color){
        this.mesh.material.emissive = new THREE.Color(color);
        this.mesh.material.needsUpdate = true; 
    }

    exportarOBJ() {
        // Crear un objeto Blob con el contenido en formato .obj
        const exporter = new OBJExporter();
        var objetoObj = exporter.parse(this.mesh);
    
        var archivoBlob = new Blob([objetoObj], { type: "text/plain" });
    
        // Crear un objeto URL para el Blob
        var urlArchivo = URL.createObjectURL(archivoBlob);
    
        // Crear un elemento <a> invisible
        var linkDescarga = document.createElement("a");
        linkDescarga.href = urlArchivo;
        linkDescarga.download = "object.obj"; // Nombre del archivo
        document.body.appendChild(linkDescarga);
    
        // Simular un clic en el enlace para iniciar la descarga
        linkDescarga.click();
    
        // Eliminar el enlace después de la descarga
        document.body.removeChild(linkDescarga);
    }
}

export { Object3D };