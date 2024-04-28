import * as THREE from 'three';
import { Object3D } from './Object3D';


class ObjectRevolution extends Object3D {
    constructor(steps, points, color) {

        
        const geometry = new THREE.BufferGeometry();

        let vertices = generateVertexRevolution(steps, points);
        
        let vertex = [];
        for(let i = 0; i < vertices.length; i++){
            vertex.push(vertices[i].x);
            vertex.push(vertices[i].y);
            vertex.push(vertices[i].z);
        }
        
        vertices = new Float32Array(vertex);

        let triangulos = makeTriangles(vertices, steps);
        let triangles = [];
        for(let i = 0; i < triangulos.length; i++){
            triangles.push(triangulos[i].x);
            triangles.push(triangulos[i].y);
            triangles.push(triangulos[i].z);
        }

        const indices = triangles;
        geometry.setIndex( indices );

        // 3 porque son 3 componentes por vertice
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

        // Escalar el objeto
        geometry.scale(0.03, 0.03, 0.03);

        
        geometry.computeVertexNormals();
        geometry.computeTangents();
        
        const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide});
        super(geometry, material);
    }

}

function generateVertexRevolution(steps, points){
    const salto = 2 * Math.PI / steps;
    const vertices = [];
    let contador = 0;

    for(let i = 0; i < steps; i++){
        for(let j = 0; j < points.length; j++){
            vertices[contador] = new THREE.Vector3(points[j].x * Math.cos(i * salto),
            points[j].y, -points[j].x * Math.sin(i * salto));
            contador++;
        }
    }

    return vertices;
}

//Despues de hacer los vertices, hacer los indices de los triangulos
function makeTriangles(vertices, steps){
    const numVertex = vertices.length / 3; //3 componentes por vertice
    const m = numVertex / steps;

    let contador = 0;
    let first = 0;
    let second = 0;
    let third = 0;

    let triangles = [];

    for (let j = 0; j < steps; ++j) {
        for (let i = 0; i < m-1; ++i) {
            //calculo para los triangulos pares

            first = (1+j*m+i)%numVertex;
            second = (i+j*m)%numVertex;
            third = ((j+1)*m+i)%numVertex;
            triangles[contador] = new THREE.Vector3(first, second, third);

            //Calculo para los trinangulos impares
            //First no cambia

            second = third;
            third = third+1;
            contador++;
            triangles[contador] = new THREE.Vector3(first, second, third);
            contador++;


        }
    }

    return triangles;
}

export { ObjectRevolution };