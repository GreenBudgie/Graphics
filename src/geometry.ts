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

    public draw(camera: Camera, context: CanvasRenderingContext2D) {
        let projection = camera.getVertexProjection(this);
        context.beginPath();
        context.arc(projection.x, projection.y, 4, 0, 2 * Math.PI, false);
        context.fill();
    }

    public move(x: number, y: number, z: number): void {
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
    public rotate(vx: number, vy: number, vz: number, angle: number): void {
        let vectorLength = Math.sqrt(vx * vx + vy * vy + vz * vz);
        if(vectorLength != 1) {
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
        this.x = rotationMatrix[0][0] * this.x + rotationMatrix[0][1] * this.y + rotationMatrix[0][2] * this.z;
        this.y = rotationMatrix[1][0] * this.x + rotationMatrix[1][1] * this.y + rotationMatrix[1][2] * this.z;
        this.z = rotationMatrix[2][0] * this.x + rotationMatrix[2][1] * this.y + rotationMatrix[2][2] * this.z;
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

    public draw(camera: Camera, context: CanvasRenderingContext2D) {
        let projection1 = camera.getVertexProjection(this.vertex1);
        let projection2 = camera.getVertexProjection(this.vertex2);
        context.beginPath();
        context.moveTo(projection1.x, projection1.y);
        context.lineTo(projection2.x, projection2.y);
        context.stroke();
    }

    public move(x: number, y: number, z: number): void {
        this.vertex1.move(x, y, z);
        this.vertex2.move(x, y, z);
    }

    public rotate(vx: number, vy: number, vz: number, angle: number): void {
        this.vertex1.rotate(vx, vy, vz, angle);
        this.vertex2.rotate(vx, vy, vz, angle);
    }

}

export class Face {
    public readonly vertices: Vertex[];

    constructor(...vertices: Vertex[]) {
        if(vertices.length < 3) throw new Error("Cannot create a face out of less than 3 vertices");
        this.vertices = vertices;
    }

    public clone(): Face {
        let verticesCopy: Vertex[] = [];
        this.vertices.forEach(vertex => verticesCopy.push(vertex.clone()));
        return new Face(...verticesCopy);
    }

    public draw(camera: Camera, context: CanvasRenderingContext2D) {
        context.beginPath();
        let firstProjection = camera.getVertexProjection(this.vertices[0]);
        context.moveTo(firstProjection.x, firstProjection.y);
        for(let i = 1; i < this.vertices.length; i++) {
            let projection = camera.getVertexProjection(this.vertices[i]);
            context.lineTo(projection.x, projection.y);
        }
        context.closePath();
        context.stroke();
    }

    public move(x: number, y: number, z: number): void {
        this.vertices.forEach(vertex => vertex.move(x, y, z));
    }

    public rotate(vx: number, vy: number, vz: number, angle: number): void {
        this.vertices.forEach(vertex => vertex.rotate(vx, vy, vz, angle));
    }

}

export class Shape {
    public readonly faces: Face[];

    constructor(...faces: Face[]) {
        this.faces = faces;
    }

    public draw(camera: Camera, context: CanvasRenderingContext2D) {
        this.faces.forEach(face => {
            face.draw(camera, context);
        });
    }

    public move(x: number, y: number, z: number): void {
        this.faces.forEach(face => face.move(x, y, z));
    }

    public rotate(vx: number, vy: number, vz: number, angle: number): void {
        this.faces.forEach(face => face.rotate(vx, vy, vz, angle));
    }

}

export class Camera {
    public readonly projectionWidth: number = 640;
    public readonly projectionHeight: number = 640;
    private _fov: number //Field of view in radians
    private nearClipPlane: number;

    constructor(fov: number = Math.PI / 2) {
        this._fov = fov;
        this.nearClipPlane = 1 / Math.tan(this._fov / 2);
    }

    get fov(): number {
        return this._fov;
    }

    set fov(fov: number) {
        this._fov = fov;
        this.nearClipPlane = 1 / Math.tan(this._fov / 2);
    }

    /**
     * Projects a 3D point (vertex) to 2D plane with scaling
     * @param vertex A vertex to project
     * @returns Scaled 2D coordinates of a projected vertex
     */
    public getVertexProjection(vertex: Vertex): {x: number, y: number} {
        let x: number = (vertex.x / vertex.z) * this.nearClipPlane * this.projectionWidth + this.projectionWidth / 2;
        let y: number = (vertex.y / vertex.z) * this.nearClipPlane * this.projectionHeight + this.projectionHeight / 2;
        return {x: x,  y: y};
    }

}