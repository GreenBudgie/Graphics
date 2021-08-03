var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Vertex, Edge } from "../src/geometry";
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';
_chai.should();
_chai.expect;
let GeometryTest = class GeometryTest {
    'Vertex equality'() {
        let vertex1 = new Vertex(1, 2, 3);
        let vertex2 = new Vertex(1.0, 2, 3);
        expect(vertex1.equals(vertex2)).true;
    }
    'Edge length'() {
        let vertex1 = new Vertex(1, 2, 3);
        let vertex2 = new Vertex(3, 4, 5);
        expect(new Edge(vertex1, vertex2).length()).closeTo(3.464, 0.01);
    }
    'Edge connection'() {
        let vertex1 = new Vertex(-1, 0, 3);
        let vertex2 = new Vertex(3, 4, 5);
        let vertex3 = new Vertex(2, -9, 3);
        let vertex4 = new Vertex(2, 3, 3);
        let edge1 = new Edge(vertex1, vertex2);
        let edge2 = new Edge(vertex2, vertex3);
        let edge3 = new Edge(vertex3, vertex4);
        expect(edge1.isConnected(edge2)).true;
        expect(edge3.isConnected(edge2)).true;
        expect(edge2.isConnected(edge3)).true;
        expect(edge3.isConnected(edge1)).false;
    }
};
__decorate([
    test
], GeometryTest.prototype, "Vertex equality", null);
__decorate([
    test
], GeometryTest.prototype, "Edge length", null);
__decorate([
    test
], GeometryTest.prototype, "Edge connection", null);
GeometryTest = __decorate([
    suite
], GeometryTest);
//# sourceMappingURL=geometry.unit.test.js.map