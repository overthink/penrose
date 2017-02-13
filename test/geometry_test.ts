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
    t.deepEqual(v2(-3.333, 4).add(v2(2, 3)), v2(-1.3330000000000002, 7));
    t.deepEqual(v2(2, 5).subtract(v2(4, -3)), v2(-2, 8));
    t.equal(v2(3, 6.5).dot(v2(10, 3)), 49.5);
    t.equal(v2(3, 4).magnitude(), 5);
    t.equal(Vector2.zero.magnitude(), 0);
    t.deepEqual(v2(5, 7).multiply(4), v2(20, 28));
    t.deepEqual(v2(5, 7).multiply(0), Vector2.zero);
    t.deepEqual(v2(5, 7).normalize(), v2(0.5812381937190965, 0.813733471206735));
    t.end();
});

test("Vector2 rotations about origin", t => {

    // 90 degrees counter-clockwise
    let rotated = v2(1, 0).rotate(Math.PI/2);
    t.equal(round(rotated.x), 0);
    t.equal(rotated.y, 1);

    // 90 degrees clockwise
    rotated = v2(1, 0).rotate(-Math.PI/2);
    t.equal(round(rotated.x), 0);
    t.equal(rotated.y, -1);

    // 360 degrees
    rotated = v2(1, 0).rotate(Math.PI * 2);
    t.equal(rotated.x, 1);
    t.equal(round(rotated.y), 0);

    t.end();
});

test("Vector2 rotations about arbitrary point", t => {
    let about = v2(4.5, 5);
    let rotated = v2(9.5, 5).rotate(Math.PI/2, about);
    t.equal(round(rotated.x), 4.5);
    t.equal(rotated.y, 10);
    t.end();
});
