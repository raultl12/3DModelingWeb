import * as THREE from 'three';
import { scene } from '../Scene';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

class ObjectGroup{
    constructor() {
        this.group = new THREE.Group();
        this.group.name = 'group';

        scene.add(this.group);

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
        this.initialScale = this.group.scale.clone();
        this.startScale = this.group.scale.clone();
        this.finalScale = this.group.scale.clone();

        this.loop = false;
    }

    add(object){
        console.log(object.toString());
        if(object.toString() === 'light'){
            this.group.attach(object.light);
        }
        else if(object.toString() === 'group'){
            this.group.attach(object.group);
        }
        else{
            this.group.attach(object.mesh);
        }
    }

    remove(object){
        let pos = new THREE.Vector3();
        if(object.mesh === undefined){
            object.light.getWorldPosition(pos);
            object.light.position.set(pos.x, pos.y, pos.z);
            scene.add(object.light);
            this.group.remove(object.light);
        }
        else{
            object.mesh.getWorldPosition(pos)
            object.mesh.position.set(pos.x, pos.y, pos.z);
            scene.add(object.mesh);
            this.group.remove(object.mesh);
        }
    }

    toString(){
        return this.group.name;
    }

    exportarOBJ() {
        // Crear un objeto Blob con el contenido en formato .obj
        const exporter = new OBJExporter();
        var objetoObj = exporter.parse(this.group);
    
        var archivoBlob = new Blob([objetoObj], { type: "text/plain" });
    
        // Crear un objeto URL para el Blob
        var urlArchivo = URL.createObjectURL(archivoBlob);
    
        // Crear un elemento <a> invisible
        var linkDescarga = document.createElement("a");
        linkDescarga.href = urlArchivo;
        linkDescarga.download = "group.obj"; // Nombre del archivo
        document.body.appendChild(linkDescarga);
    
        // Simular un clic en el enlace para iniciar la descarga
        linkDescarga.click();
    
        // Eliminar el enlace después de la descarga
        document.body.removeChild(linkDescarga);
    }

    exportarGLTF() {
        const exporter = new GLTFExporter();
        exporter.parse(this.group, function (result) {
            var output = JSON.stringify(result, null, 2);
            var blob = new Blob([output], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);

            link.href = url;
            link.download = 'group.gltf';
            link.click();
            document.body.removeChild(link);
        });
    }

    setAnimationParams(animate, animations, loop){

        this.group.position.set(animations[0].translation.x, animations[0].translation.y, animations[0].translation.z);
        this.group.rotation.set(animations[0].rotation.x, animations[0].rotation.y, animations[0].rotation.z);
        this.group.scale.set(this.initialScale.x * animations[0].scale.x, this.initialScale.y * animations[0].scale.y, this.initialScale.z * animations[0].scale.z);

        this.animate = animate;
        this.animations = animations;

        this.angles = animations[0].rotation.clone();
        this.startRotation = this.group.rotation.clone();
        this.startPosition = this.group.position.clone();
        this.finalScale = new THREE.Vector3(this.initialScale.x * this.animations[0].scale.x, 
                                            this.initialScale.y * this.animations[0].scale.y,
                                            this.initialScale.z * this.animations[0].scale.z);

        let axis = new THREE.Vector3();
        axis.subVectors(this.animations[0].translation, this.group.position);
        this.axisNormalized = axis.normalize();

        this.loop = loop;
    }

    getRotationStringDegrees(){
        let x = 0;
        let y = 0;
        let z = 0;

        let xDeg = THREE.MathUtils.radToDeg(this.group.rotation.x);
        let yDeg = THREE.MathUtils.radToDeg(this.group.rotation.y);
        let zDeg = THREE.MathUtils.radToDeg(this.group.rotation.z);

        x = Math.round((xDeg + Number.EPSILON) * 100) / 100;
        y = Math.round((yDeg + Number.EPSILON) * 100) / 100;
        z = Math.round((zDeg + Number.EPSILON) * 100) / 100;

        return x + ", " + y + ", " + z;
    }

    getPositionString(){
        let x = Math.round((this.group.position.x + Number.EPSILON) * 100) / 100;
        let y = Math.round((this.group.position.y + Number.EPSILON) * 100) / 100;
        let z = Math.round((this.group.position.z + Number.EPSILON) * 100) / 100;

        return x + ", " + y + ", " + z;
    }

    getScaleString(){
        let x = Math.round((this.group.scale.x + Number.EPSILON) * 100) / 100;
        let y = Math.round((this.group.scale.y + Number.EPSILON) * 100) / 100;
        let z = Math.round((this.group.scale.z + Number.EPSILON) * 100) / 100;

        return x + ", " + y + ", " + z;
    }

    update(delta){
        if(this.animate){
            if(this.animations.length != 0 && 
                this.animations[0].infiniteRotation[0] != 0 && 
                this.animations[0].infiniteRotation[1] != 0 && 
                this.animations[0].infiniteRotation[2] != 0)
             {
                this.group.rotateOnAxis(this.animations[0].infiniteRotation, delta * this.animations[0].speed);
             }

            if(this.alpha < 1 && this.animations.length != 0){
                
                this.group.scale.x = THREE.MathUtils.lerp(this.startScale.x, this.finalScale.x, this.alpha);
                this.group.scale.y = THREE.MathUtils.lerp(this.startScale.y, this.finalScale.y, this.alpha);
                this.group.scale.z = THREE.MathUtils.lerp(this.startScale.z, this.finalScale.z, this.alpha);
                
                this.group.rotation.x = THREE.MathUtils.lerp(this.startRotation.x, this.angles.x, this.alpha);
                this.group.rotation.y = THREE.MathUtils.lerp(this.startRotation.y, this.angles.y, this.alpha);
                this.group.rotation.z = THREE.MathUtils.lerp(this.startRotation.z, this.angles.z, this.alpha);

                this.group.position.x = THREE.MathUtils.lerp(this.startPosition.x, this.animations[0].translation.x, this.alpha);
                this.group.position.y = THREE.MathUtils.lerp(this.startPosition.y, this.animations[0].translation.y, this.alpha);
                this.group.position.z = THREE.MathUtils.lerp(this.startPosition.z, this.animations[0].translation.z, this.alpha);    
                this.alpha += delta * this.animations[0].speed;
            }
            else{
                if(this.animations.length-1 != 0){
                    this.alpha = 0;
                    if(this.loop){
                        this.animations.push(this.animations[0]);
                    }
                    this.animations.shift();

                    if(this.group.rotation.x > 2*Math.PI){
                        this.group.rotation.x = 0;
                    }
                    if(this.group.rotation.y > 2*Math.PI){
                        this.group.rotation.y = 0;
                    }
                    if(this.group.rotation.z > 2*Math.PI){
                        this.group.rotation.z = 0;
                    }

                    this.angles = this.animations[0].rotation.clone();
                    this.startRotation = this.group.rotation.clone();
                    this.startPosition = this.group.position.clone();
                    this.startScale = this.group.scale.clone();
                    this.finalScale = new THREE.Vector3(this.initialScale.x * this.animations[0].scale.x, 
                                                        this.initialScale.y * this.animations[0].scale.y,
                                                        this.initialScale.z * this.animations[0].scale.z);
    
                    let axis = new THREE.Vector3();
                    axis.subVectors(this.animations[0].translation, this.group.position);
                    this.axisNormalized = axis.normalize();
                }
            }
        }
    }
}

export { ObjectGroup };