export class Point3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    equals(point) {
        return this.x == point.x && this.y == point.y && this.z == point.z;
    }
    clone() {
        return new Point3D(this.x, this.y, this.z);
    }
    distance(point) {
        let x = this.x - point.x;
        let y = this.y - point.y;
        let z = this.z - point.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    translate(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copyCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
    }
    rotateX(point, angle) {
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
        let xMatrix = [
            [1, 0, 0],
            [0, cosA, -sinA],
            [0, sinA, cosA]
        ];
        this.rotateByMatrix(point, xMatrix);
    }
    rotateY(point, angle) {
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
        let yMatrix = [
            [cosA, 0, sinA],
            [0, 1, 0],
            [-sinA, 0, cosA]
        ];
        this.rotateByMatrix(point, yMatrix);
    }
    rotateZ(point, angle) {
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
        let zMatrix = [
            [cosA, -sinA, 0],
            [sinA, cosA, 0],
            [0, 0, 1]
        ];
        this.rotateByMatrix(point, zMatrix);
    }
    /**
     * Rotates the point around the arbitrary axis (a unit vector) and a point.
     * The given vector might not be normalized on input.
     * @param point The point to rotate around
     * @param vx X vector component
     * @param vy Y vector component
     * @param vz Z vector component
     * @param angle Rotation angle in radians
     */
    rotate(point, vx, vy, vz, angle) {
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
        this.rotateByMatrix(point, rotationMatrix);
    }
    rotateByMatrix(point, rotationMatrix) {
        let translatedX = this.x - point.x;
        let translatedY = this.y - point.y;
        let translatedZ = this.z - point.z;
        let x = rotationMatrix[0][0] * translatedX + rotationMatrix[0][1] * translatedY + rotationMatrix[0][2] * translatedZ;
        let y = rotationMatrix[1][0] * translatedX + rotationMatrix[1][1] * translatedY + rotationMatrix[1][2] * translatedZ;
        let z = rotationMatrix[2][0] * translatedX + rotationMatrix[2][1] * translatedY + rotationMatrix[2][2] * translatedZ;
        this.x = x + point.x;
        this.y = y + point.y;
        this.z = z + point.z;
    }
}
export class Vertex extends Point3D {
    draw(camera, context) {
        let projection = camera.getVertexProjection(this);
        context.beginPath();
        context.arc(projection.x, projection.y, 4, 0, 2 * Math.PI, false);
        context.fill();
    }
    equals(vertex) {
        return this.x == vertex.x && this.y == vertex.y && this.z == vertex.z;
    }
    clone() {
        return new Vertex(this.x, this.y, this.z);
    }
}
export class Face {
    constructor(vertex1, vertex2, vertex3) {
        this.vertices = [];
        this.adjacentFaces = [];
        if (vertex1.equals(vertex2) || vertex1.equals(vertex3) || vertex2.equals(vertex3))
            throw new Error("The face cannot have identical vertices");
        this.vertices[0] = vertex1;
        this.vertices[1] = vertex2;
        this.vertices[2] = vertex3;
    }
    clone() {
        return new Face(this.vertices[0].clone(), this.vertices[1].clone(), this.vertices[2].clone());
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
    getIdenticalVerticesCount(anotherFace) {
        let sameVertices = 0;
        this.vertices.forEach(vertex => {
            anotherFace.vertices.forEach(anotherVertex => {
                if (vertex.equals(anotherVertex))
                    sameVertices++;
            });
        });
        return sameVertices;
    }
    getAdjacentVertices(anotherFace) {
        let adjacentVertices = [];
        this.vertices.forEach(vertex => {
            anotherFace.vertices.forEach(anotherVertex => {
                if (vertex.equals(anotherVertex))
                    adjacentVertices.push(vertex);
            });
        });
        return adjacentVertices.length == 2 ? adjacentVertices : null;
    }
    isAdjacent(anotherFace) {
        return this.getIdenticalVerticesCount(anotherFace) == 2;
    }
    equals(anotherFace) {
        return this.getIdenticalVerticesCount(anotherFace) == 3;
    }
    translate(x, y, z) {
        this.vertices.forEach(vertex => vertex.translate(x, y, z));
    }
    rotate(point, vx, vy, vz, angle) {
        this.vertices.forEach(vertex => vertex.rotate(point, vx, vy, vz, angle));
    }
}
export class ShapeBuilder {
    constructor() {
        this.faces = [];
        this.origin = new Point3D(0, 0, 0);
    }
    /**
     * Defines the vertices the shape will have, but doesn't make any connections between them
     * @param vertices Vertices to define
     */
    defineVertices(...vertices) {
        if (this.vertices != undefined)
            throw new Error("Vertices may only be defined once");
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                if (vertices[i].equals(vertices[j]))
                    throw new Error("The shape must have no identical vertices");
            }
        }
        this.vertices = vertices;
        return this;
    }
    /**
     * Defines a new face by the given vertex indices.
     * Vertices must be defined first.
     */
    defineFace(vertex1, vertex2, vertex3) {
        if (this.vertices == undefined)
            throw new Error("Vertices are not yet defined");
        let newFace = new Face(this.vertices[vertex1], this.vertices[vertex2], this.vertices[vertex3]);
        this.faces.forEach(face => {
            if (face.equals(newFace))
                throw new Error("There cannot be identical faces on the shape");
        });
        this.faces.push(newFace);
        return this;
    }
    /**
     * Defines any number of triangular faces by the given vertices.
     * Vertices will be connected sequentially to the first given vertex.
     * This method is great for defining polygons.
     */
    defineFaces(...vertices) {
        if (vertices.length < 3)
            throw new Error("No faces can be defined out of less that 3 vertices");
        ;
        if (this.vertices == undefined)
            throw new Error("Vertices are not yet defined");
        this.defineFace(vertices[0], vertices[1], vertices[2]);
        for (let i = 2; i < vertices.length - 1; i++) {
            this.defineFace(vertices[0], vertices[i], vertices[i + 1]);
        }
        return this;
    }
    defineOrigin(origin) {
        this.origin = origin;
        return this;
    }
    build() {
        if (this.vertices == undefined)
            throw new Error("Cannot build a shape: vertices are not yet defined");
        if (this.faces.length == 0)
            throw new Error("Cannot build a shape: there are no faces defined");
        this.faces.forEach(face => {
            this.faces.forEach(anotherFace => {
                if (!face.equals(anotherFace) && face.isAdjacent(anotherFace))
                    face.adjacentFaces.push(anotherFace);
            });
        });
        //Checking that all faces are connected
        let checked = [];
        function checkRecursively(face) {
            checked.push(face);
            face.adjacentFaces.forEach(adjacentFace => {
                if (!checked.includes(adjacentFace))
                    checkRecursively(adjacentFace);
            });
        }
        ;
        checkRecursively(this.faces[0]);
        if (checked.length != this.faces.length) {
            this.faces.forEach(face => face.adjacentFaces = []);
            throw new Error("Cannot build a shape: not all faces are connected");
        }
        return new Shape(this.vertices, this.faces, this.origin);
    }
}
export class Shape {
    constructor(vertices, faces, origin) {
        this.drawOptions = { vertex: false, edge: true, face: true };
        this.vertices = vertices;
        this.faces = faces;
        this.origin = origin;
    }
    draw(camera, context) {
        if (this.drawOptions.vertex) {
            this.vertices.forEach(vertex => {
                vertex.draw(camera, context);
            });
        }
        if (this.drawOptions.face) {
            this.faces.forEach(face => {
                face.draw(camera, context);
            });
        }
    }
    clone() {
        let verticesCopy = [];
        this.vertices.forEach(vertex => verticesCopy.push(vertex.clone()));
        let facesCopy = [];
        this.faces.forEach(face => {
            let newVertices = [];
            for (let i = 0; i < face.vertices.length; i++) {
                for (let j = 0; j < verticesCopy.length; j++) {
                    if (face.vertices[i].equals(verticesCopy[j])) {
                        newVertices.push(verticesCopy[j]);
                        break;
                    }
                }
            }
            facesCopy.push(new Face(newVertices[0], newVertices[1], newVertices[2]));
        });
        let shapeCopy = new Shape(verticesCopy, facesCopy, this.origin.clone());
        shapeCopy.drawOptions = this.drawOptions;
        return shapeCopy;
    }
    translate(x, y, z) {
        this.origin.translate(x, y, z);
        this.vertices.forEach(vertex => vertex.translate(x, y, z));
    }
    /**
     * Moves all vertices to their initial positions by placing the origin to (0, 0, 0)
     */
    resetTranslation() {
        this.translate(-this.origin.x, -this.origin.y, -this.origin.z);
    }
    rotateX(angle) {
        this.vertices.forEach(vertex => vertex.rotateX(this.origin, angle));
    }
    rotateXAround(point, angle) {
        this.origin.rotateX(point, angle);
        this.vertices.forEach(vertex => vertex.rotateX(point, angle));
    }
    rotateY(angle) {
        this.vertices.forEach(vertex => vertex.rotateY(this.origin, angle));
    }
    rotateYAround(point, angle) {
        this.origin.rotateY(point, angle);
        this.vertices.forEach(vertex => vertex.rotateY(point, angle));
    }
    rotateZ(angle) {
        this.vertices.forEach(vertex => vertex.rotateZ(this.origin, angle));
    }
    rotateZAround(point, angle) {
        this.origin.rotateZ(point, angle);
        this.vertices.forEach(vertex => vertex.rotateZ(point, angle));
    }
    rotate(vx, vy, vz, angle) {
        this.rotateAround(this.origin, vx, vy, vz, angle);
    }
    rotateAround(point, vx, vy, vz, angle) {
        this.origin.rotate(point, vx, vy, vz, angle);
        this.vertices.forEach(vertex => vertex.rotate(point, vx, vy, vz, angle));
    }
}
export class Camera {
    constructor(fov = Math.PI / 2) {
        this.projectionWidth = 640;
        this.projectionHeight = 640;
        this.position = new Point3D(0, 0, 0);
        this.target = new Point3D(0, 0, 0);
        this.rotationHorizontal = 0;
        this.rotationVertical = 0;
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
    translate(x, y, z) {
        this.position.translate(x, y, z);
        this.target.translate(x, y, z);
    }
    rotateAroundTarget(yaw, pitch) {
        this.position.rotateY(this.target, yaw);
        this.position.rotateX(this.target, pitch);
        //this.position.rotateZ(this.target, pitch * Math.sin(yaw));
    }
    rotateTargetAroundCamera(yaw, pitch) {
    }
    /**
     * Projects a 3D point (vertex) to 2D plane with scaling
     * @param vertex A vertex to project
     * @returns Scaled 2D coordinates of a projected vertex
     */
    getVertexProjection(vertex) {
        let vertexCopy = vertex.clone();
        vertexCopy.translate(-this.position.x, -this.position.y, -this.position.z);
        vertexCopy.rotateY(new Point3D(0, 0, 0), -this.rotationHorizontal);
        vertexCopy.rotate(new Point3D(0, 0, 0), Math.cos(this.rotationHorizontal), 0, Math.sin(this.rotationHorizontal), -this.rotationVertical);
        let x = (vertexCopy.x / vertexCopy.z) * this.nearClipPlane * this.projectionWidth + this.projectionWidth / 2;
        let y = -(vertexCopy.y / vertexCopy.z) * this.nearClipPlane * this.projectionHeight + this.projectionHeight / 2;
        return { x: x, y: y };
    }
}
//# sourceMappingURL=geometry.js.map