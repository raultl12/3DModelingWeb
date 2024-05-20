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

        this.animate = false;
        //Rotations
        this.rotX = false;
        this.rotY = false;
        this.rotZ = false;
        this.speedX = 0.01;
        this.speedY = 0.01;
        this.speedZ = 0.01;

        this.translations = [];
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

    setAnimationParams(
        animate,
        rotateX,
        rotateY,
        rotateZ,
        speedX,
        speedY,
        speedZ,
        translations
    ){
        this.animate = animate;
        this.rotX = rotateX;
        this.rotY = rotateY;
        this.rotZ = rotateZ;
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
        this.translations = translations;
    }

    rotateX(angle){
        this.group.rotateX(angle);
    }

    rotateY(angle){
        this.group.rotateY(angle);
    }

    rotateZ(angle){
        this.group.rotateZ(angle);
    }

    update(delta){
        if(this.animate){
            if(this.rotX) this.rotateX(this.speedX * delta);
            if(this.rotY) this.rotateY(this.speedY * delta);
            if(this.rotZ) this.rotateZ(this.speedZ * delta);

            if(this.translations.length != 0){
                let axis = new THREE.Vector3();
                axis.subVectors(this.translations[0].to, this.translations[0].from);
                let axisNormalized = axis.normalize();
    
                //Translate
                this.group.translateOnAxis(axisNormalized, this.translations[0].speed * delta);
    
                //Check if translation is finished
                if(this.group.position.distanceTo(this.translations[0].to) < 0.1){
                    if(document.getElementById("loopTranslations").checked){
                        this.translations.push(this.translations[0]);
                    }
                    this.translations.shift();
                }
            }
        }
    }
}

export { ObjectGroup };