export class Point3D {
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
    
    public translate(x: number, y: number, z: number): void {
        this.x += x;
        this.y += y;
        this.z += z;
    }

    /**
     * Rotates the point around the arbitrary axis (a unit vector).
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
        
        let x = rotationMatrix[0][0] * this.x + rotationMatrix[0][1] * this.y + rotationMatrix[0][2] * this.z;
        let y = rotationMatrix[1][0] * this.x + rotationMatrix[1][1] * this.y + rotationMatrix[1][2] * this.z;
        let z = rotationMatrix[2][0] * this.x + rotationMatrix[2][1] * this.y + rotationMatrix[2][2] * this.z;
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

export class Vertex extends Point3D {

    public draw(camera: Camera, context: CanvasRenderingContext2D) {
        let projection = camera.getVertexProjection(this);
        context.beginPath();
        context.arc(projection.x, projection.y, 4, 0, 2 * Math.PI, false);
        context.fill();
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
        this.vertex1.translate(x, y, z);
        this.vertex2.translate(x, y, z);
    }

    public rotate(vx: number, vy: number, vz: number, angle: number): void {
        this.vertex1.rotate(vx, vy, vz, angle);
        this.vertex2.rotate(vx, vy, vz, angle);
    }

}

export class Face {
    public readonly vertices: Vertex[] = [];
    public adjacentFaces: Face[] = [];

    constructor(vertex1: Vertex, vertex2: Vertex, vertex3: Vertex) {
        if(vertex1.equals(vertex2) || vertex1.equals(vertex3) || vertex2.equals(vertex3)) throw new Error("The face cannot have identical vertices");
        this.vertices[0] = vertex1;
        this.vertices[1] = vertex2;
        this.vertices[2] = vertex3;
    }

    public clone(): Face {
        return new Face(this.vertices[0].clone(), this.vertices[1].clone(), this.vertices[2].clone());
    }

    public draw(camera: Camera, context: CanvasRenderingContext2D): void {
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

    public getIdenticalVerticesCount(anotherFace: Face): number {
        let sameVertices = 0;
        this.vertices.forEach(vertex => {
            anotherFace.vertices.forEach(anotherVertex => {
                if(vertex.equals(anotherVertex)) sameVertices++;
            });
        });
        return sameVertices;
    }

    public getAdjacentVertices(anotherFace: Face): Vertex[] | null {
        let adjacentVertices: Vertex[] = [];
        this.vertices.forEach(vertex => {
            anotherFace.vertices.forEach(anotherVertex => {
                if(vertex.equals(anotherVertex)) adjacentVertices.push(vertex);
            });
        });
        return adjacentVertices.length == 2 ? adjacentVertices : null;
    }

    public isAdjacent(anotherFace: Face): boolean {
        return this.getIdenticalVerticesCount(anotherFace) == 2;
    }

    public equals(anotherFace: Face): boolean {
        return this.getIdenticalVerticesCount(anotherFace) == 3;
    }

    public move(x: number, y: number, z: number): void {
        this.vertices.forEach(vertex => vertex.translate(x, y, z));
    }

    public rotate(vx: number, vy: number, vz: number, angle: number): void {
        this.vertices.forEach(vertex => vertex.rotate(vx, vy, vz, angle));
    }

}

export class ShapeBuilder {
    public vertices: Vertex[];
    public faces: Face[] = [];

    /**
     * Defines the vertices the shape will have, but doesn't make any connections between them
     * @param vertices Vertices to define
     */
    public defineVertices(...vertices: Vertex[]): ShapeBuilder {
        if(this.vertices != undefined) throw new Error("Vertices may only be defined once");
        for(let i = 0; i < vertices.length; i++) {
            for(let j = i + 1; j < vertices.length; j++) {
                if(vertices[i].equals(vertices[j])) throw new Error("The shape must have no identical vertices");
            }
        }
        this.vertices = vertices;
        return this;
    }

    /**
     * Defines a new face by the given vertex indices.
     * Vertices must be defined first.
     */
     public defineFace(vertex1: number, vertex2: number, vertex3: number): ShapeBuilder {
        if(this.vertices == undefined) throw new Error("Vertices are not yet defined");
        let newFace: Face = new Face(this.vertices[vertex1], this.vertices[vertex2], this.vertices[vertex3]);
        this.faces.forEach(face => {
            if(face.equals(newFace)) throw new Error("There cannot be identical faces on the shape");
        });
        this.faces.push(newFace);
        return this;
    }

    /**
     * Defines any number of triangular faces by the given vertices.
     * Vertices will be connected sequentially to the first given vertex.
     * This method is great for defining polygons.
     */
    public defineFaces(...vertices: number[]): ShapeBuilder {
        if(vertices.length < 3) throw new Error("No faces can be defined out of less that 3 vertices");;
        if(this.vertices == undefined) throw new Error("Vertices are not yet defined");
        this.defineFace(vertices[0], vertices[1], vertices[2]);
        for(let i = 2; i < vertices.length - 1; i++) {
            this.defineFace(vertices[0], vertices[i], vertices[i + 1]);
        }
        return this;
    }

    public build(): Shape {
        if(this.vertices == undefined) throw new Error("Cannot build a shape: vertices are not yet defined");
        if(this.faces.length == 0) throw new Error("Cannot build a shape: there are no faces defined");
        this.faces.forEach(face => {
            this.faces.forEach(anotherFace => {
                if(!face.equals(anotherFace) && face.isAdjacent(anotherFace)) face.adjacentFaces.push(anotherFace);
            });
        });
        //Checking that all faces are connected
        let checked: Face[] = [];
        function checkRecursively(face: Face) {
            checked.push(face);
            face.adjacentFaces.forEach(adjacentFace => {
                if(!checked.includes(adjacentFace)) checkRecursively(adjacentFace);
            });
        };
        checkRecursively(this.faces[0]);
        if(checked.length != this.faces.length) {
            this.faces.forEach(face => face.adjacentFaces = []);
            throw new Error("Cannot build a shape: not all faces are connected");
        }
        return new Shape(this.vertices, this.faces);
    }

}

export class Shape {
    public readonly vertices: Vertex[];
    public readonly faces: Face[];
    public drawOptions = {vertex: false, edge: true, face: true};

    constructor(vertices: Vertex[], faces: Face[]) {
        this.vertices = vertices;
        this.faces = faces;
    }

    public draw(camera: Camera, context: CanvasRenderingContext2D): void {
        if(this.drawOptions.vertex) {
            this.vertices.forEach(vertex => {
                vertex.draw(camera, context);
            });
        }
        if(this.drawOptions.face) {
            this.faces.forEach(face => {
                face.draw(camera, context);
            });
        }
    }

    public clone(): Shape {
        let verticesCopy: Vertex[] = [];
        this.vertices.forEach(vertex => verticesCopy.push(vertex.clone()));
        let facesCopy: Face[] = [];
        this.faces.forEach(face => {
            let newVertices: Vertex[] = [];
            for(let i = 0; i < face.vertices.length; i++) {
                for(let j = 0; j < verticesCopy.length; j++) {
                    if(face.vertices[i].equals(verticesCopy[j])) {
                        newVertices.push(verticesCopy[j]);
                        break;
                    }
                }
            }
            facesCopy.push(new Face(newVertices[0], newVertices[1], newVertices[2]));
        });
        let shapeCopy: Shape = new Shape(verticesCopy, facesCopy);
        shapeCopy.drawOptions = this.drawOptions;
        return shapeCopy;
    }

    public move(x: number, y: number, z: number): void {
        this.vertices.forEach(vertex => vertex.translate(x, y, z));
    }

    public rotate(vx: number, vy: number, vz: number, angle: number): void {
        this.vertices.forEach(vertex => vertex.rotate(vx, vy, vz, angle));
    }

}

export class Camera {
    public readonly projectionWidth: number = 640;
    public readonly projectionHeight: number = 640;
    public readonly position: Point3D = new Point3D(0, 0, 0);
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
        let x: number = ((vertex.x - this.position.x) / (vertex.z - this.position.z)) * this.nearClipPlane * this.projectionWidth + this.projectionWidth / 2;
        let y: number = -((vertex.y - this.position.y) / (vertex.z - this.position.z)) * this.nearClipPlane * this.projectionHeight + this.projectionHeight / 2;
        return {x: x,  y: y};
    }

}