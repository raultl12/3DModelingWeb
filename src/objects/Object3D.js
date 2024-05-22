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
        /*this.rotX = false;
        this.rotY = false;
        this.rotZ = false;
        this.speedX = 0.01;
        this.speedY = 0.01;
        this.speedZ = 0.01;

        this.translations = [];
        this.scales = [];*/
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

    /*setAnimationParams(
        animate,
        rotateX,
        rotateY,
        rotateZ,
        speedX,
        speedY,
        speedZ,
        translations,
        scales
    ){
        this.animate = animate;
        this.rotX = rotateX;
        this.rotY = rotateY;
        this.rotZ = rotateZ;
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
        this.translations = translations;
        this.scales = scales;
    }*/

    setAnimationParams(animate, animations){
        this.animate = animate;
        this.animations = animations;

        this.angles = animations[0].rotation.clone();
        this.startRotation = this.mesh.rotation.clone();
        this.startPosition = this.mesh.position.clone();

        let axis = new THREE.Vector3();
        axis.subVectors(this.animations[0].translation, this.mesh.position);
        this.axisNormalized = axis.normalize();
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
            if(this.alpha < 1 && this.animations.length != 0){
                console.log(this.alpha);
                if(this.mesh.rotation.y < this.angles.y){
                    //this.mesh.rotateOnAxis(this.animations[0].rotation.normalize(), this.angles.y * delta * this.animations[0].speed);
                    this.mesh.rotation.x = THREE.MathUtils.lerp(this.startRotation.x, this.angles.x, this.alpha);
                    this.mesh.rotation.y = THREE.MathUtils.lerp(this.startRotation.y, this.angles.y, this.alpha);
                    this.mesh.rotation.z = THREE.MathUtils.lerp(this.startRotation.z, this.angles.z, this.alpha);
                }
    
                if(this.mesh.position.distanceTo(this.animations[0].translation) > 0.1){
                    //this.mesh.position.lerp(this.animations[0].translation, this.alpha);
                    this.mesh.position.x = THREE.MathUtils.lerp(this.startPosition.x, this.animations[0].translation.x, this.alpha);
                    this.mesh.position.y = THREE.MathUtils.lerp(this.startPosition.y, this.animations[0].translation.y, this.alpha);
                    this.mesh.position.z = THREE.MathUtils.lerp(this.startPosition.z, this.animations[0].translation.z, this.alpha);

                }
    
                this.alpha += delta;
            }
            /*if(this.rotX) this.rotateX(this.speedX * delta);
            if(this.rotY) this.rotateY(this.speedY * delta);
            if(this.rotZ) this.rotateZ(this.speedZ * delta);

            if(this.translations.length != 0){
                let axis = new THREE.Vector3();
                axis.subVectors(this.translations[0].to, this.translations[0].from);
                let axisNormalized = axis.normalize();
    
                //Translate
                this.mesh.translateOnAxis(axisNormalized, this.translations[0].speed * delta);
    
                //Check if translation is finished
                if(this.mesh.position.distanceTo(this.translations[0].to) < 0.1){
                    if(document.getElementById("loopTranslations").checked){
                        this.translations.push(this.translations[0]);
                    }
                    this.translations.shift();
                }
            }

            if(this.scales.length != 0){
                let axis = this.scales[0].axis;
                let factor = this.scales[0].factor;
                let downScaling = false;
                if(factor < 1){
                    downScaling = true;
                }

                let finalX = this.initialScale.x * factor;
                let finalY = this.initialScale.y * factor;
                let finalZ = this.initialScale.z * factor;

                switch(axis){
                    case "x":
                        if(downScaling){
                            this.mesh.scale.x -= factor * delta;
                        }
                        else{
                            this.mesh.scale.x += factor * delta;
                        }
                        break;
                    case "y":
                        if(downScaling){
                            this.mesh.scale.y -= factor * delta;
                        }
                        else{
                            this.mesh.scale.y += factor * delta;
                        }
                        break;
                    case "z":
                        if(downScaling){
                            this.mesh.scale.z -= factor * delta;
                        }
                        else{
                            this.mesh.scale.z += factor * delta;
                        }
                        break;
                }

                if(downScaling && (this.mesh.scale.x < finalX || this.mesh.scale.y < finalY || this.mesh.scale.z < finalZ)){
                    if(document.getElementById("loopScales").checked){
                        this.scales.push(this.scales[0]);
                    }
                    this.scales.shift();
                    this.initialScale = this.mesh.scale.clone();
                }
                else{
                    if(!downScaling && (this.mesh.scale.x > finalX || this.mesh.scale.y > finalY || this.mesh.scale.z > finalZ)){
                        if(document.getElementById("loopScales").checked){
                            this.scales.push(this.scales[0]);
                        }
                        this.scales.shift();
                        this.initialScale = this.mesh.scale.clone();
                    }
                }
            }*/
        }
    }
}

export { Object3D };