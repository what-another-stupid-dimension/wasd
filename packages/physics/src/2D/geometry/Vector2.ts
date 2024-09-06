class Vector2 {
    constructor(public x: number = 0, public y: number = 0) {}

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y)
    }

    angleBetween(v: Vector2): number {
        const dotProduct = this.dot(v)
        const magA = this.magnitude()
        const magB = v.magnitude()
        return Math.acos(dotProduct / (magA * magB))
    }

    clampMagnitude(max: number): Vector2 {
        const mag = this.magnitude()
        if (mag > max) {
            return this.normalize().multiply(max)
        }
        return this
    }

    componentAlong(v: Vector2): Vector2 {
        return v.normalize().multiply(this.dot(v.normalize()))
    }

    distanceTo(v: Vector2): number {
        return Vector2.distance(this, v)
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y
    }

    length(): number {
        return Math.sqrt(this.dot(this))
    }

    lerp(v: Vector2, t: number): Vector2 {
        return this.add(v.subtract(this).multiply(t))
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    normalize(): Vector2 {
        const len = this.length()
        return len > 0 ? this.multiply(1 / len) : new Vector2(0, 0)
    }

    project(v: Vector2): Vector2 {
        const scalar = this.dot(v) / v.dot(v)
        return v.multiply(scalar)
    }

    reflect(normal: Vector2): Vector2 {
        const dotProduct = this.dot(normal)
        return this.subtract(normal.multiply(2 * dotProduct))
    }

    scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y)
    }

    static distance(v1: Vector2, v2: Vector2): number {
        return v1.subtract(v2).length()
    }

    static zero(): Vector2 {
        return new Vector2(0, 0)
    }
}

export default Vector2
