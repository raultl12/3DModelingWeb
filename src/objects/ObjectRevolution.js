import * as THREE from 'three';
import { Object3D } from './Object3D';


class ObjectRevolution extends Object3D {
    constructor(steps, points, color) {
        const geometry = new THREE.BufferGeometry();

        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        let vertices = generateVertexRevolution(steps, points);

        let vertex = [];
        for(let i = 0; i < vertices.length; i++){
            vertex.push(vertices[i].x);
            vertex.push(vertices[i].y);
            vertex.push(vertices[i].z);
        }

        vertices = new Float32Array(vertex);
        console.log(vertices);
        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        
        const material = new THREE.MeshStandardMaterial({ color: color});
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

export { ObjectRevolution };

/*
void _object3d_revolution::vertexRevolution(int n, vector<_vertex3f> curve){
    float salto = 2 * PI/n;
    Vertices.clear();
    Vertices.resize(n * curve.size());
    int contador = 0;

    for(int i = 0; i < n; i++){

        for(int j = 0; j < (int)curve.size(); j++){
            Vertices[contador] = _vertex3f(curve[j].x * cos(i * salto),
            curve[j].y, -curve[j].x * sin(i * salto));
            contador++;
        }
    }

}
*/