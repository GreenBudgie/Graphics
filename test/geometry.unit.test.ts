import { Vertex, Face, Shape, ShapeBuilder } from "../src/geometry"
import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import { expect } from 'chai';

_chai.should();
_chai.expect;

@suite class GeometryTest {

    @test 'Vertex equality'() {
        let vertex1: Vertex = new Vertex(1, 2, 3);
        let vertex2: Vertex = new Vertex(1.0, 2, 3);
        expect(vertex1.equals(vertex2)).to.be.true;
    }

    @test 'Face equality'() {
        let face1: Face = new Face(new Vertex(1, 2, 3), new Vertex(4, 5, 6), new Vertex(7, 8, 9));
        let face2: Face = new Face(new Vertex(1, 2, 3), new Vertex(4, 5, 6), new Vertex(7, 8, 9));
        let face3: Face = new Face(new Vertex(1, 2, 3), new Vertex(4, 0, 6), new Vertex(7, 8, 9));
        expect(face1.equals(face2)).to.be.true;
        expect(face1.equals(face3)).to.be.false;
    }

    @test 'Shape build errors'() {
        let cubeBuilder: ShapeBuilder = new ShapeBuilder;
        cubeBuilder.defineVertices(
            new Vertex(1, 1, 1),
            new Vertex(1, -1, 1),
            new Vertex(-1, -1, 1),
            new Vertex(-1, 1, 1),
            new Vertex(1, 1, -1),
            new Vertex(1, -1, -1),
            new Vertex(-1, -1, -1),
            new Vertex(-1, 1, -1),
        )
        .defineFaces(0, 3, 7, 4)
        .defineFaces(1, 2, 6, 5);
        expect(() => cubeBuilder.build()).to.throw("Cannot build a shape: not all faces are connected");
        cubeBuilder.defineFaces(0, 1, 2, 3)
        expect(() => cubeBuilder.build()).to.not.throw();
    }

}