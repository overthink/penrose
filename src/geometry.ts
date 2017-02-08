/**
 * A 2D vector aka point.
 */
export class Vector {
    constructor(readonly x: number, readonly y: number) {}

    static add(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static subtract(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static multiply(scalar: number, v: Vector): Vector {
        return new Vector(v.x * scalar, v.y * scalar);
    }

    static magnitude(v: Vector): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    static normalize(v: Vector): Vector {
        const mag = Vector.magnitude(v);
        if (mag == 0) {
            throw new Error("v has magnitude 0");
        }
        return Vector.multiply(1 / mag, v);
    }

    static dot(v1: Vector, v2: Vector): number {
        return v1.x * v2.x + v1.y * v2.y;
    }
}
