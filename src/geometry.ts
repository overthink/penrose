/**
 * The general approach here is that "primitives" like vectors and shapes are
 * mutable for perf reasons. However, most operations return `this`, so method
 * chaining still works. Also, most classes contain a `copy` method, so you can
 * get immutable-like style. e.g.
 *
 * const v = new Vec2(2, 3);
 * v.add(new Vec2(4, 5)); // v is changed in place
 * v.add(new Vec2(4, 5)).subtract(new Vec2(3, 4.5)); // still changing v
 * v.copy().add(new Vec2(4, 5)); // v unchanged, returns new instance
 *
 * Same approach for all primitives in this API.
 */

export type Radians = number // just for documentation purposes

export const Phi = (1 + Math.sqrt(5)) / 2;

/**
 * A 2D vector aka point.
 */
export class Vec2 {
    constructor(
        public x: number,
        public y: number) {}

    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    add(v: Vec2): Vec2 {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v: Vec2): Vec2 {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(scalar: number): Vec2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vec2 {
        const mag = this.magnitude();
        if (mag == 0) {
            throw new Error("cannot normalize vector of magnitude 0");
        }
        return this.multiply(1 / mag);
    }

    dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Return a new point that is this point rotated 'theta' radians
     * counterclockwise about point 'about'.
     */
    rotate(theta: Radians, about: Vec2 = Vec2.zero) {
        // Use homogeneous coordinates to do the translation to origin
        // rotation, and translation back in one shot.
        // see 1.2 in http://web.cs.iastate.edu/~cs577/handouts/homogeneous-transform.pdf
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const newX = this.x * cosT - this.y * sinT - about.x * cosT + about.y * sinT + about.x;
        const newY = this.x * sinT + this.y * cosT - about.x * sinT - about.y * cosT + about.y;
        this.x = newX;
        this.y = newY;
        return this;
    }

    static zero = new Vec2(0, 0);
}

export class Triangle {
    a: Vec2;
    b: Vec2;
    c: Vec2;
    colour: string;

    /** Create a new triangle using __copies__ of a, b, and c. */
    constructor(a: Vec2, b: Vec2, c: Vec2, colour: string) {
        // Should I do this, or have two constructors, I wonder... Will stick
        // with this till need for non-copying constructor appears.
        this.a = a.copy();
        this.b = b.copy();
        this.c = c.copy();
        this.colour = colour;
    }

    copy(): Triangle {
        return new Triangle(this.a, this.b, this.c, this.colour);
    }

    rotate(theta: Radians, about: Vec2 = Vec2.zero): Triangle {
        this.a.rotate(theta, about);
        this.b.rotate(theta, about);
        this.c.rotate(theta, about);
        return this;
    }

}
