import * as test from "tape";
import {Vector2} from "../src/geometry";

// short form to create new Vector2 instances
function v2(x: number, y: number): Vector2 {
    return new Vector2(x, y);
}

// 4 decimal places ought to be enough for anyone
function round(n: number): number {
    return Math.round(n * 10000) / 10000;
}

test("Vector2 properties", t => {
    const v = v2(3, 5);
    t.equal(v.x, 3, "x property works");
    t.equal(v.y, 5, "y property works");
    t.end();
});

test("Vector2 basic operations", t => {
    t.deepEqual(Vector2.add(v2(-3.333, 4), v2(2, 3)), v2(-1.3330000000000002, 7));
    t.deepEqual(Vector2.subtract(v2(2, 5), v2(4, -3)), v2(-2, 8));
    t.equal(Vector2.dot(v2(3, 6.5), v2(10, 3)), 49.5);
    t.equal(Vector2.magnitude(v2(3, 4)), 5);
    t.equal(Vector2.magnitude(Vector2.zero), 0);
    t.deepEqual(Vector2.multiply(4, v2(5, 7)), v2(20, 28));
    t.deepEqual(Vector2.multiply(0, v2(5, 7)), Vector2.zero);
    t.deepEqual(Vector2.normalize(v2(5, 7)), v2(0.5812381937190965, 0.813733471206735));
    t.end();
});

test("Vector2 rotations about origin", t => {

    // 90 degrees counter-clockwise
    let rotated = Vector2.rotate(v2(1, 0), Math.PI/2);
    t.equal(round(rotated.x), 0);
    t.equal(rotated.y, 1);

    // 90 degrees clockwise
    rotated = Vector2.rotate(v2(1, 0), -Math.PI/2);
    t.equal(round(rotated.x), 0);
    t.equal(rotated.y, -1);

    // 360 degrees
    rotated = Vector2.rotate(v2(1, 0), Math.PI * 2);
    t.equal(rotated.x, 1);
    t.equal(round(rotated.y), 0);

    t.end();
});

test("Vector2 rotations about arbitrary point", t => {
    let about = v2(4.5, 5);
    let rotated = Vector2.rotate(v2(9.5, 5), Math.PI/2, about);
    t.equal(round(rotated.x), 4.5);
    t.equal(rotated.y, 10);
    t.end();
});
