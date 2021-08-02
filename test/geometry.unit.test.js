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
    before() {
        this.vertex1 = new geometry_1.Vertex(1, 2, 3);
        this.vertex1_same = new geometry_1.Vertex(1, 2, 3);
        this.vertex2 = new geometry_1.Vertex(3, 4, 5);
        this.edge1 = new geometry_1.Edge(this.vertex1, this.vertex2);
    }
    'Vertex equality'() {
        chai_1.expect(this.vertex1.equals(this.vertex1_same)).true;
    }
    'Edge length'() {
        chai_1.expect(this.edge1.length()).closeTo(3.464, 0.01);
    }
};
__decorate([
    mocha_1.test
], GeometryTest.prototype, "Vertex equality", null);
__decorate([
    mocha_1.test
], GeometryTest.prototype, "Edge length", null);
GeometryTest = __decorate([
    mocha_1.suite
], GeometryTest);
//# sourceMappingURL=geometry.unit.test.js.map