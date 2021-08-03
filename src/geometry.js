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
}
export class Face {
    constructor(...vertices) {
        if (vertices.length < 3)
            throw new Error("Cannot create a face out of less than 3 vertices");
        this.vertices = vertices;
    }
}
export class Camera {
    constructor() {
        this.projectionWidth = 640;
        this.projectionHeight = 640;
        this.fov = Math.PI / 2; //Field of view in radians
        this.nearClipPlane = 1 / Math.tan(this.fov / 2);
    }
    /**
     * Projects a 3D point (vertex) to 2D plane with scaling
     * @param vertex A vertex to project
     * @returns Scaled 2D coordinates of a projected vertex
     */
    getVertexProjection(vertex) {
        let x = (vertex.x / vertex.z) * this.nearClipPlane * this.projectionWidth;
        let y = (vertex.y / vertex.z) * this.nearClipPlane * this.projectionHeight;
        return { x: x, y: y };
    }
}
//# sourceMappingURL=geometry.js.map