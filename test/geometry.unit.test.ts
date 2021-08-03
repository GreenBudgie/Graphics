import { Vertex, Edge, Face } from "../src/geometry"
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';

_chai.should();
_chai.expect;

@suite class GeometryTest {

    @test 'Vertex equality'() {
        let vertex1: Vertex = new Vertex(1, 2, 3);
        let vertex2: Vertex = new Vertex(1.0, 2, 3);
        expect(vertex1.equals(vertex2)).true;
    }

    @test 'Edge length'() {
        let vertex1: Vertex = new Vertex(1, 2, 3);
        let vertex2: Vertex = new Vertex(3, 4, 5);
        expect(new Edge(vertex1, vertex2).length()).closeTo(3.464, 0.01);
    }

    @test 'Edge connection'() {
        let vertex1: Vertex = new Vertex(-1, 0, 3);
        let vertex2: Vertex = new Vertex(3, 4, 5);
        let vertex3: Vertex = new Vertex(2, -9, 3);
        let vertex4: Vertex = new Vertex(2, 3, 3);
        let edge1: Edge = new Edge(vertex1, vertex2);
        let edge2: Edge = new Edge(vertex2, vertex3);
        let edge3: Edge = new Edge(vertex3, vertex4);
        expect(edge1.isConnected(edge2)).true;
        expect(edge3.isConnected(edge2)).true;
        expect(edge2.isConnected(edge3)).true;
        expect(edge3.isConnected(edge1)).false;
    }

}