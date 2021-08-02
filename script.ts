class Vertex {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public equals(vertex: Vertex): boolean {
        return this.x == vertex.x && this.y == vertex.y && this.z == vertex.z;
    }
}

class Edge {
    readonly vertex1: Vertex;
    readonly vertex2: Vertex;

    constructor(vertex1: Vertex, vertex2: Vertex) {
        if(vertex1.equals(vertex2)) throw new Error("Cannot create an edge out of two identical vertices");
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }

    equals(edge: Edge): boolean {
        return (this.vertex1.equals(edge.vertex1) && this.vertex2.equals(edge.vertex2)) || (this.vertex2.equals(edge.vertex1) && this.vertex1.equals(edge.vertex2));
    }

    /**
     * Returns whether the given edge is connected to the current by one of its vertices
     */
    isConnected(edge: Edge): boolean {
        return this.vertex1.equals(edge.vertex1) || this.vertex1.equals(edge.vertex2);
    }
}

class Face {
    readonly edges: Edge[];

    constructor(...edge: Edge[]) {

    }
}

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
