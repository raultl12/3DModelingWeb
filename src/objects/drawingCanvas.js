import * as THREE from 'three';

class DrawingCanvas{
    constructor(){
        this.hidden = true;
        this.points = [];
        this.currentPoint = null;
        this.canvas = document.getElementById("revolutionCanvas");
        this.context = this.canvas.getContext("2d");
        this.context.lineWidth = 0.5;
        // Dibuja los ejes
        this.drawAxis();
    }

    getHidden(){
        return this.hidden;
    }

    getCanvas(){
        return this.canvas;
    }

    getPoints(){
        return this.points;
    }

    switchVisibility(){
        this.hidden = !this.hidden;
    }

    drawAxis(){
        this.context.beginPath();
        this.context.strokeStyle = "white";

        this.context.moveTo(this.canvas.width / 2, 0);
        this.context.lineTo(this.canvas.width / 2, this.canvas.height);

        this.context.moveTo(0, this.canvas.height / 2);
        this.context.lineTo(this.canvas.width, this.canvas.height / 2);

        this.context.stroke();
        this.context.closePath();
    }


    addPoint(x, y){
        if(this.currentPoint == null){
            this.currentPoint = new THREE.Vector2(x, y);
            this.points.push(this.currentPoint);
            this.context.beginPath();
            this.context.arc(x, y, 1, 0, 2 * Math.PI);
            this.context.fillStyle = "white";
            this.context.fill();
            this.context.closePath();
        }
        else{
            this.lineTo(x, y);
        }
    }

    lineTo(x, y){
        this.context.beginPath();
        this.context.moveTo(this.currentPoint.x, this.currentPoint.y);
        this.context.lineTo(x, y);
        this.context.strokeStyle = "white";
        this.context.stroke();
        this.context.closePath();
        this.currentPoint = new THREE.Vector2(x, y);
        this.points.push(this.currentPoint);
    }

    clear(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAxis();
        this.points = [];
        this.currentPoint = null;
    }

}

export { DrawingCanvas }