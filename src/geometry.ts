export class Vertex {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public equals(vertex: Vertex): boolean {
        return this.x == vertex.x && this.y == vertex.y && this.z == vertex.z;
    }

    public clone(): Vertex {
        return new Vertex(this.x, this.y, this.z);
    }
    
}

export class Edge {
    public readonly vertex1: Vertex;
    public readonly vertex2: Vertex;

    constructor(vertex1: Vertex, vertex2: Vertex) {
        if(vertex1.equals(vertex2)) throw new Error("Cannot create an edge out of two identical vertices");
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }

    public equals(edge: Edge): boolean {
        return (this.vertex1.equals(edge.vertex1) && this.vertex2.equals(edge.vertex2)) || (this.vertex2.equals(edge.vertex1) && this.vertex1.equals(edge.vertex2));
    }

    /**
     * Returns whether the given edge is connected to the current one by one of its vertices
     */
    public isConnected(edge: Edge): boolean {
        return this.vertex1.equals(edge.vertex1) || this.vertex1.equals(edge.vertex2) || this.vertex2.equals(edge.vertex1) || this.vertex2.equals(edge.vertex2);
    }

    public length(): number {
        return Math.sqrt(Math.pow(this.vertex1.x - this.vertex2.x, 2) + Math.pow(this.vertex1.y - this.vertex2.y, 2) + Math.pow(this.vertex1.z - this.vertex2.z, 2));
    }

    public clone(): Edge {
        return new Edge(this.vertex1.clone(), this.vertex2.clone());
    }
}

export class Face {
    public readonly vertices: Vertex[];

    constructor(...vertices: Vertex[]) {
        if(vertices.length < 3) throw new Error("Cannot create a face out of less than 3 vertices");
        this.vertices = vertices;
    }
}

export class Camera {
    public readonly projectionWidth: number = 640;
    public readonly projectionHeight: number = 640;
    public readonly fov: number = Math.PI / 2; //Field of view in radians
    public readonly nearClipPlane: number = 1 / Math.tan(this.fov / 2);

    /**
     * Projects a 3D point (vertex) to 2D plane with scaling
     * @param vertex A vertex to project
     * @returns Scaled 2D coordinates of a projected vertex
     */
    public getVertexProjection(vertex: Vertex): {x: number, y: number} {
        let x: number = (vertex.x / vertex.z) * this.nearClipPlane * this.projectionWidth;
        let y: number = (vertex.y / vertex.z) * this.nearClipPlane * this.projectionHeight;
        return {x: x,  y: y};
    }

}