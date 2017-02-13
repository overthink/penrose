type Radians = number

/**
 * A 2D vector aka point.
 */
export class Vector2 {
    constructor(readonly x: number, readonly y: number) {}

    static add(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    static subtract(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static multiply(scalar: number, v: Vector2): Vector2 {
        return new Vector2(v.x * scalar, v.y * scalar);
    }

    static magnitude(v: Vector2): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    static normalize(v: Vector2): Vector2 {
        const mag = Vector2.magnitude(v);
        if (mag == 0) {
            throw new Error("v has magnitude 0");
        }
        return Vector2.multiply(1 / mag, v);
    }

    static dot(v1: Vector2, v2: Vector2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    /**
     * Return a new point that is point 'p' rotated 'theta' radians
     * counter-clockwise about point 'about'.
     */
    static rotate(p: Vector2, theta: Radians, about: Vector2 = Vector2.zero) {
        // Use homogeneous coordinates to do the translation to origin
        // rotation, and translation back in one shot.
        // see 1.2 in http://web.cs.iastate.edu/~cs577/handouts/homogeneous-transform.pdf
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const newX = p.x * cosT - p.y * sinT - about.x * cosT + about.y * sinT + about.x;
        const newY = p.x * sinT + p.y * cosT - about.x * sinT - about.y * cosT + about.y;
        return new Vector2(newX, newY);
    }

    static zero = new Vector2(0, 0);
}

export class Triangle {
    constructor(
        readonly a: Vector2,
        readonly b: Vector2,
        readonly c: Vector2) {}

    static translate(t: Triangle, v: Vector2): Triangle {
        return new Triangle(
            Vector2.add(t.a, v),
            Vector2.add(t.b, v),
            Vector2.add(t.c, v));
    }

    static rotate(t: Triangle, theta: Radians, about: Vector2 = Vector2.zero): Triangle {
        return new Triangle(
            Vector2.rotate(t.a, theta, about),
            Vector2.rotate(t.b, theta, about),
            Vector2.rotate(t.c, theta, about));
    }

}

