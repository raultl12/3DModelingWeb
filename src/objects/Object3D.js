import * as THREE from 'three';
import { scene } from '../Scene';
import { MaterialProperty } from '../utils';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

class Object3D {
    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = "object3D";
        scene.add(this.mesh);

        this.edges = new THREE.EdgesGeometry( geometry ); 
        this.line = new THREE.LineSegments(this.edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); 
        this.mesh.add( this.line );

        this.inGroup = false;

        //Animations
        this.animate = false;
        //Rotations
        this.rotX = false;
        this.rotY = false;
        this.rotZ = false;
        this.speedX = 0.01;
        this.speedY = 0.01;
        this.speedZ = 0.01;
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

    toString(){
        return this.mesh.name;
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

    exportarGLTF() {
        const exporter = new GLTFExporter();
        exporter.parse(this.mesh, function (result) {
            var output = JSON.stringify(result, null, 2);
            var blob = new Blob([output], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);

            link.href = url;
            link.download = 'object.gltf';
            link.click();
            document.body.removeChild(link);
        });
    }

    clone(){
        let meshClone = this.mesh.clone();
        let geometryClone = this.geometry.clone();
        let materialClone = this.material.clone();
        let obj =  new Object3D(geometryClone, materialClone);
        obj.mesh.position.set(meshClone.position.x, meshClone.position.y, meshClone.position.z);
        obj.mesh.scale.set(meshClone.scale.x, meshClone.scale.y, meshClone.scale.z);
        obj.mesh.rotation.set(meshClone.rotation.x, meshClone.rotation.y, meshClone.rotation.z);
        return obj;
    }

    setAnimationParams(
        animate,
        rotateX,
        rotateY,
        rotateZ,
        speedX,
        speedY,
        speedZ
    ){
        this.animate = animate;
        this.rotX = rotateX;
        this.rotY = rotateY;
        this.rotZ = rotateZ;
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
    }

    rotateX(angle){
        this.mesh.rotateX(angle);
    }

    rotateY(angle){
        this.mesh.rotateY(angle);
    }

    rotateZ(angle){
        this.mesh.rotateZ(angle);
    }

    update(delta){
        if(this.animate){
            if(this.rotX) this.rotateX(this.speedX * delta);
            if(this.rotY) this.rotateY(this.speedY * delta);
            if(this.rotZ) this.rotateZ(this.speedZ * delta);
        }
    }
}

export { Object3D };