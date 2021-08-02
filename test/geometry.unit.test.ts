import { Vertex, Edge, Face } from "../src/geometry"
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';

_chai.should();
_chai.expect;

@suite class GeometryTest {
    private vertex1: Vertex;
    private vertex1_same: Vertex;
    private vertex2: Vertex;
    private edge1: Edge;

    before() {
        this.vertex1 = new Vertex(1, 2, 3);
        this.vertex1_same = new Vertex(1, 2, 3);
        this.vertex2 = new Vertex(3, 4, 5);
        this.edge1 = new Edge(this.vertex1, this.vertex2);
    }

    @test 'Vertex equality'() {
        expect(this.vertex1.equals(this.vertex1_same)).true;
    }

    @test 'Edge length'() {
        expect(this.edge1.length()).closeTo(3.464, 0.01);
    }

}