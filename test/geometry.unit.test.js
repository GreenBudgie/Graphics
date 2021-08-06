"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const geometry_1 = require("../src/geometry");
const mocha_1 = require("@testdeck/mocha");
const _chai = require("chai");
const chai_1 = require("chai");
_chai.should();
_chai.expect;
let GeometryTest = class GeometryTest {
    'Vertex equality'() {
        let vertex1 = new geometry_1.Vertex(1, 2, 3);
        let vertex2 = new geometry_1.Vertex(1.0, 2, 3);
        chai_1.expect(vertex1.equals(vertex2)).true;
    }
    'Edge length'() {
        let vertex1 = new geometry_1.Vertex(1, 2, 3);
        let vertex2 = new geometry_1.Vertex(3, 4, 5);
        chai_1.expect(new geometry_1.Edge(vertex1, vertex2).length()).closeTo(3.464, 0.01);
    }
    'Edge connection'() {
        let vertex1 = new geometry_1.Vertex(-1, 0, 3);
        let vertex2 = new geometry_1.Vertex(3, 4, 5);
        let vertex3 = new geometry_1.Vertex(2, -9, 3);
        let vertex4 = new geometry_1.Vertex(2, 3, 3);
        let edge1 = new geometry_1.Edge(vertex1, vertex2);
        let edge2 = new geometry_1.Edge(vertex2, vertex3);
        let edge3 = new geometry_1.Edge(vertex3, vertex4);
        chai_1.expect(edge1.isConnected(edge2)).true;
        chai_1.expect(edge3.isConnected(edge2)).true;
        chai_1.expect(edge2.isConnected(edge3)).true;
        chai_1.expect(edge3.isConnected(edge1)).false;
    }
    'Face equality'() {
        let face1 = new geometry_1.Face(new geometry_1.Vertex(1, 2, 3), new geometry_1.Vertex(4, 5, 6), new geometry_1.Vertex(7, 8, 9));
        let face2 = new geometry_1.Face(new geometry_1.Vertex(1, 2, 3), new geometry_1.Vertex(4, 5, 6), new geometry_1.Vertex(7, 8, 9));
        let face3 = new geometry_1.Face(new geometry_1.Vertex(1, 2, 3), new geometry_1.Vertex(4, 0, 6), new geometry_1.Vertex(7, 8, 9));
        chai_1.expect(face1.equals(face2)).true;
        chai_1.expect(face1.equals(face3)).false;
    }
    'Shape build errors'() {
        let cubeBuilder = new geometry_1.ShapeBuilder;
        cubeBuilder.defineVertices(new geometry_1.Vertex(1, 1, 1), new geometry_1.Vertex(1, -1, 1), new geometry_1.Vertex(-1, -1, 1), new geometry_1.Vertex(-1, 1, 1), new geometry_1.Vertex(1, 1, -1), new geometry_1.Vertex(1, -1, -1), new geometry_1.Vertex(-1, -1, -1), new geometry_1.Vertex(-1, 1, -1))
            .defineFaces(0, 3, 7, 4)
            .defineFaces(1, 2, 6, 5);
        chai_1.expect(() => cubeBuilder.build()).to.throw("Cannot build a shape: not all faces are connected");
        cubeBuilder.defineFaces(0, 1, 2, 3);
        chai_1.expect(() => cubeBuilder.build()).to.not.throw();
    }
};
__decorate([
    mocha_1.test
], GeometryTest.prototype, "Vertex equality", null);
__decorate([
    mocha_1.test
], GeometryTest.prototype, "Edge length", null);
__decorate([
    mocha_1.test
], GeometryTest.prototype, "Edge connection", null);
__decorate([
    mocha_1.test
], GeometryTest.prototype, "Face equality", null);
__decorate([
    mocha_1.test
], GeometryTest.prototype, "Shape build errors", null);
GeometryTest = __decorate([
    mocha_1.suite
], GeometryTest);
//# sourceMappingURL=geometry.unit.test.js.map