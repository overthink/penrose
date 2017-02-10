import * as test from "tape";
import {Vector} from "../src/geometry";

test("Vector properties work", t => {
    const v = new Vector(3, 5);
    t.equal(v.x, 3);
    t.equal(v.y, 5);
    t.end();
});
