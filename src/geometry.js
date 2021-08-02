"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Face = exports.Edge = exports.Vertex = void 0;
class Vertex {
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
exports.Vertex = Vertex;
class Edge {
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
exports.Edge = Edge;
class Face {
    constructor(...vertices) {
        if (vertices.length < 3)
            throw new Error("Cannot create a face out of two vertices");
        this.vertices = vertices;
    }
}
exports.Face = Face;
//# sourceMappingURL=geometry.js.map