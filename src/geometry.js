export class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    equals(vertex) {
        return this.x == vertex.x && this.y == vertex.y && this.z == vertex.z;
    }
    clone() {
        return new Vertex(this.x, this.y, this.z);
    }
    draw(camera, context) {
        let projection = camera.getVertexProjection(this);
        context.beginPath();
        context.arc(projection.x, projection.y, 4, 0, 2 * Math.PI, false);
        context.fill();
    }
    move(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
    /**
     * Rotates the vertex around the arbitrary axis (a unit vector).
     * The given vector might not be normalized on input.
     * @param vx X vector component
     * @param vy Y vector component
     * @param vz Z vector component
     * @param angle Rotation angle in radians
     */
    rotate(vx, vy, vz, angle) {
        let vectorLength = Math.sqrt(vx * vx + vy * vy + vz * vz);
        if (vectorLength != 1) {
            //Normalize
            vx = vx / vectorLength;
            vy = vy / vectorLength;
            vz = vz / vectorLength;
        }
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
        let rotationMatrix = [
            [cosA + vx * vx * (1 - cosA), vx * vy * (1 - cosA) - vz * sinA, vx * vz * (1 - cosA) + vy * sinA],
            [vy * vx * (1 - cosA) + vz * sinA, cosA + vy * vy * (1 - cosA), vy * vz * (1 - cosA) - vx * sinA],
            [vz * vx * (1 - cosA) - vy * sinA, vz * vy * (1 - cosA) + vx * sinA, cosA + vz * vz * (1 - cosA)]
        ];
        let x = rotationMatrix[0][0] * this.x + rotationMatrix[0][1] * this.y + rotationMatrix[0][2] * this.z;
        let y = rotationMatrix[1][0] * this.x + rotationMatrix[1][1] * this.y + rotationMatrix[1][2] * this.z;
        let z = rotationMatrix[2][0] * this.x + rotationMatrix[2][1] * this.y + rotationMatrix[2][2] * this.z;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export class Edge {
    constructor(vertex1, vertex2) {
        if (vertex1.equals(vertex2))
            throw new Error("Cannot create an edge out of two identical vertices");
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }
    equals(edge) {
        return (this.vertex1.equals(edge.vertex1) && this.vertex2.equals(edge.vertex2)) || (this.vertex2.equals(edge.vertex1) && this.vertex1.equals(edge.vertex2));
    }
    /**
     * Returns whether the given edge is connected to the current one by one of its vertices
     */
    isConnected(edge) {
        return this.vertex1.equals(edge.vertex1) || this.vertex1.equals(edge.vertex2) || this.vertex2.equals(edge.vertex1) || this.vertex2.equals(edge.vertex2);
    }
    length() {
        return Math.sqrt(Math.pow(this.vertex1.x - this.vertex2.x, 2) + Math.pow(this.vertex1.y - this.vertex2.y, 2) + Math.pow(this.vertex1.z - this.vertex2.z, 2));
    }
    clone() {
        return new Edge(this.vertex1.clone(), this.vertex2.clone());
    }
    draw(camera, context) {
        let projection1 = camera.getVertexProjection(this.vertex1);
        let projection2 = camera.getVertexProjection(this.vertex2);
        context.beginPath();
        context.moveTo(projection1.x, projection1.y);
        context.lineTo(projection2.x, projection2.y);
        context.stroke();
    }
    move(x, y, z) {
        this.vertex1.move(x, y, z);
        this.vertex2.move(x, y, z);
    }
    rotate(vx, vy, vz, angle) {
        this.vertex1.rotate(vx, vy, vz, angle);
        this.vertex2.rotate(vx, vy, vz, angle);
    }
}
export class Face {
    constructor(...vertices) {
        if (vertices.length < 3)
            throw new Error("Cannot create a face out of less than 3 vertices");
        this.vertices = vertices;
    }
    clone() {
        let verticesCopy = [];
        this.vertices.forEach(vertex => verticesCopy.push(vertex.clone()));
        return new Face(...verticesCopy);
    }
    draw(camera, context) {
        context.beginPath();
        let firstProjection = camera.getVertexProjection(this.vertices[0]);
        context.moveTo(firstProjection.x, firstProjection.y);
        for (let i = 1; i < this.vertices.length; i++) {
            let projection = camera.getVertexProjection(this.vertices[i]);
            context.lineTo(projection.x, projection.y);
        }
        context.closePath();
        context.stroke();
    }
    move(x, y, z) {
        this.vertices.forEach(vertex => vertex.move(x, y, z));
    }
    rotate(vx, vy, vz, angle) {
        this.vertices.forEach(vertex => vertex.rotate(vx, vy, vz, angle));
    }
}
export class Shape {
    constructor(...faces) {
        this.faces = faces;
    }
    draw(camera, context) {
        this.faces.forEach(face => {
            face.draw(camera, context);
        });
    }
    move(x, y, z) {
        this.faces.forEach(face => face.move(x, y, z));
    }
    rotate(vx, vy, vz, angle) {
        this.faces.forEach(face => face.rotate(vx, vy, vz, angle));
    }
}
export class Camera {
    constructor(fov = Math.PI / 2) {
        this.projectionWidth = 640;
        this.projectionHeight = 640;
        this._fov = fov;
        this.nearClipPlane = 1 / Math.tan(this._fov / 2);
    }
    get fov() {
        return this._fov;
    }
    set fov(fov) {
        this._fov = fov;
        this.nearClipPlane = 1 / Math.tan(this._fov / 2);
    }
    /**
     * Projects a 3D point (vertex) to 2D plane with scaling
     * @param vertex A vertex to project
     * @returns Scaled 2D coordinates of a projected vertex
     */
    getVertexProjection(vertex) {
        let x = (vertex.x / vertex.z) * this.nearClipPlane * this.projectionWidth + this.projectionWidth / 2;
        let y = (-vertex.y / vertex.z) * this.nearClipPlane * this.projectionHeight + this.projectionHeight / 2;
        return { x: x, y: y };
    }
}
//# sourceMappingURL=geometry.js.map