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
        this.animations = [];
        this.alpha = 0;
        
        //Rotations
        this.angles = new THREE.Vector3(0, 0, 0);
        this.startRotation = new THREE.Vector3(0, 0, 0);

        //Translations
        this.axisNormalized = new THREE.Vector3(0, 0, 0);
        this.startPosition = new THREE.Vector3(0, 0, 0);

        //Scales
        this.initialScale = this.mesh.scale.clone();
        this.startScale = this.mesh.scale.clone();
        this.finalScale = this.mesh.scale.clone();

        this.loop = false;
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

    setAnimationParams(animate, animations, loop){

        this.mesh.position.set(animations[0].translation.x, animations[0].translation.y, animations[0].translation.z);
        this.mesh.rotation.set(animations[0].rotation.x, animations[0].rotation.y, animations[0].rotation.z);
        this.mesh.scale.set(this.initialScale.x * animations[0].scale.x, this.initialScale.y * animations[0].scale.y, this.initialScale.z * animations[0].scale.z);

        this.animate = animate;
        this.animations = animations;

        this.angles = animations[0].rotation.clone();
        this.startRotation = this.mesh.rotation.clone();
        this.startPosition = this.mesh.position.clone();
        this.finalScale = new THREE.Vector3(this.initialScale.x * this.animations[0].scale.x, 
                                            this.initialScale.y * this.animations[0].scale.y,
                                            this.initialScale.z * this.animations[0].scale.z);

        let axis = new THREE.Vector3();
        axis.subVectors(this.animations[0].translation, this.mesh.position);
        this.axisNormalized = axis.normalize();

        this.loop = loop;
    }

    getRotationStringDegrees(){
        let x = 0;
        let y = 0;
        let z = 0;

        let xDeg = THREE.MathUtils.radToDeg(this.mesh.rotation.x);
        let yDeg = THREE.MathUtils.radToDeg(this.mesh.rotation.y);
        let zDeg = THREE.MathUtils.radToDeg(this.mesh.rotation.z);

        x = Math.round((xDeg + Number.EPSILON) * 100) / 100;
        y = Math.round((yDeg + Number.EPSILON) * 100) / 100;
        z = Math.round((zDeg + Number.EPSILON) * 100) / 100;
        //z = (Math.round(THREE.MathUtils.radToDeg(this.mesh.rotation.z)*100) / 100 + 360) % 360;

        return x + ", " + y + ", " + z;
    }

    getPositionString(){
        let x = Math.round((this.mesh.position.x + Number.EPSILON) * 100) / 100;
        let y = Math.round((this.mesh.position.y + Number.EPSILON) * 100) / 100;
        let z = Math.round((this.mesh.position.z + Number.EPSILON) * 100) / 100;

        return x + ", " + y + ", " + z;
    }

    getScaleString(){
        let x = Math.round((this.mesh.scale.x + Number.EPSILON) * 100) / 100;
        let y = Math.round((this.mesh.scale.y + Number.EPSILON) * 100) / 100;
        let z = Math.round((this.mesh.scale.z + Number.EPSILON) * 100) / 100;

        return x + ", " + y + ", " + z;
    }

    update(delta){
        if(this.animate){
            if(this.animations.length != 0 && this.animations[0].infiniteRotation != "none"){
                switch(this.animations[0].infiniteRotation){
                    case "x":
                        //this.mesh.rotateX(delta);
                        this.mesh.rotation.x += delta;
                        break;
                    case "y":
                        this.mesh.rotateY(delta);
                        break;
                    case "z":
                        this.mesh.rotateZ(delta);
                        break;
                }
            }

            if(this.alpha < 1 && this.animations.length != 0){
                
                this.mesh.scale.x = THREE.MathUtils.lerp(this.startScale.x, this.finalScale.x, this.alpha);
                this.mesh.scale.y = THREE.MathUtils.lerp(this.startScale.y, this.finalScale.y, this.alpha);
                this.mesh.scale.z = THREE.MathUtils.lerp(this.startScale.z, this.finalScale.z, this.alpha);
                
                this.mesh.rotation.x = THREE.MathUtils.lerp(this.startRotation.x, this.angles.x, this.alpha);
                this.mesh.rotation.y = THREE.MathUtils.lerp(this.startRotation.y, this.angles.y, this.alpha);
                this.mesh.rotation.z = THREE.MathUtils.lerp(this.startRotation.z, this.angles.z, this.alpha);

                this.mesh.position.x = THREE.MathUtils.lerp(this.startPosition.x, this.animations[0].translation.x, this.alpha);
                this.mesh.position.y = THREE.MathUtils.lerp(this.startPosition.y, this.animations[0].translation.y, this.alpha);
                this.mesh.position.z = THREE.MathUtils.lerp(this.startPosition.z, this.animations[0].translation.z, this.alpha);    
                this.alpha += delta;
            }
            else{
                if(this.animations.length-1 != 0){
                    this.alpha = 0;
                    if(this.loop){
                        this.animations.push(this.animations[0]);
                    }
                    this.animations.shift();

                    if(this.mesh.rotation.x > 2*Math.PI){
                        this.mesh.rotation.x = 0;
                    }
                    if(this.mesh.rotation.y > 2*Math.PI){
                        this.mesh.rotation.y = 0;
                    }
                    if(this.mesh.rotation.z > 2*Math.PI){
                        this.mesh.rotation.z = 0;
                    }

                    this.angles = this.animations[0].rotation.clone();
                    this.startRotation = this.mesh.rotation.clone();
                    this.startPosition = this.mesh.position.clone();
                    this.startScale = this.mesh.scale.clone();
                    this.finalScale = new THREE.Vector3(this.initialScale.x * this.animations[0].scale.x, 
                                                        this.initialScale.y * this.animations[0].scale.y,
                                                        this.initialScale.z * this.animations[0].scale.z);
    
                    let axis = new THREE.Vector3();
                    axis.subVectors(this.animations[0].translation, this.mesh.position);
                    this.axisNormalized = axis.normalize();
                }
            }
        }
    }
}

export { Object3D };