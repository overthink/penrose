export type Radians = number // just for documentation purposes

export const Phi = (1 + Math.sqrt(5)) / 2;

/**
 * A 2D vector aka point.
 */
export class Vector2 {
    constructor(readonly x: number, readonly y: number) {}

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        const mag = this.magnitude();
        if (mag == 0) {
            throw new Error("this vector has magnitude 0");
        }
        return this.multiply(1 / mag);
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Return a new point that is this point rotated 'theta' radians
     * counter-clockwise about point 'about'.
     */
    rotate(theta: Radians, about: Vector2 = Vector2.zero) {
        // Use homogeneous coordinates to do the translation to origin
        // rotation, and translation back in one shot.
        // see 1.2 in http://web.cs.iastate.edu/~cs577/handouts/homogeneous-transform.pdf
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const newX = this.x * cosT - this.y * sinT - about.x * cosT + about.y * sinT + about.x;
        const newY = this.x * sinT + this.y * cosT - about.x * sinT - about.y * cosT + about.y;
        return new Vector2(newX, newY);
    }

    static zero = new Vector2(0, 0);
}

export class Triangle {
    constructor(
        readonly a: Vector2,
        readonly b: Vector2,
        readonly c: Vector2,
        readonly colour: string) {}

    translate(v: Vector2): Triangle {
        return new Triangle(this.a.add(v), this.b.add(v), this.c.add(v), this.colour);
    }

    rotate(theta: Radians, about: Vector2 = Vector2.zero): Triangle {
        return new Triangle(
            this.a.rotate(theta, about),
            this.b.rotate(theta, about),
            this.c.rotate(theta, about),
            this.colour);
    }

}

