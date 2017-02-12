import * as test from "tape";
import {Vector} from "../src/geometry";

test("Vector properties work", t => {
    const v = new Vector(3, 5);
    t.equal(v.x, 3, "x property works");
    t.equal(v.y, 5, "y property works");
    t.end();
});

test("test that waits around", t => {
    t.plan(3);
    t.equal(1, 1, "one is one");
    setTimeout(() => {
        t.equal(42, 42, "answer ok");
    }, 500);
    t.equal(2, 2, "two is 2.");
});
