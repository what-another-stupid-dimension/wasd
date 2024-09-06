class Vector3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    angleBetween(v: Vector3): number {
        const dotProduct = this.dot(v)
        const magA = this.magnitude()
        const magB = v.magnitude()
        return Math.acos(dotProduct / (magA * magB))
    }

    clampMagnitude(max: number): Vector3 {
        const mag = this.magnitude()
        if (mag > max) {
            return this.normalize().multiply(max)
        }
        return this
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z)
    }

    componentAlong(v: Vector3): Vector3 {
        return v.normalize().multiply(this.dot(v.normalize()))
    }

    cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x,
        )
    }

    distanceTo(v: Vector3): number {
        return Vector3.distance(this, v)
    }

    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0
    }

    length(): number {
        return Math.sqrt(this.dot(this))
    }

    lerp(v: Vector3, t: number): Vector3 {
        return this.add(v.subtract(this).multiply(t))
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
    }

    multiply(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    normalize(): Vector3 {
        const len = this.length()
        return len > 0 ? this.multiply(1 / len) : new Vector3(0, 0, 0)
    }

    project(v: Vector3): Vector3 {
        const scalar = this.dot(v) / v.dot(v)
        return v.multiply(scalar)
    }

    reflect(normal: Vector3): Vector3 {
        const dotProduct = this.dot(normal)
        return this.subtract(normal.multiply(2 * dotProduct))
    }

    scale(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    subtract(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    static distance(v1: Vector3, v2: Vector3): number {
        return v1.subtract(v2).length()
    }

    static zero(): Vector3 {
        return new Vector3(0, 0, 0)
    }
}

export default Vector3
