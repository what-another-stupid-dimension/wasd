import Vector3 from '../geometry/Vector3'

class Box {
    constructor(public min: Vector3, public max: Vector3) {}

    getBoundingBox() {
        return new Box(this.min, this.max)
    }

    getVertices(): Vector3[] {
        return [
            new Vector3(this.min.x, this.min.y, this.min.z),
            new Vector3(this.max.x, this.min.y, this.min.z),
            new Vector3(this.max.x, this.max.y, this.min.z),
            new Vector3(this.min.x, this.max.y, this.min.z),
            new Vector3(this.min.x, this.min.y, this.max.z),
            new Vector3(this.max.x, this.min.y, this.max.z),
            new Vector3(this.max.x, this.max.y, this.max.z),
            new Vector3(this.min.x, this.max.y, this.max.z),
        ]
    }

    expandToFit(point: Vector3): void {
        this.min = new Vector3(
            Math.min(this.min.x, point.x),
            Math.min(this.min.y, point.y),
            Math.min(this.min.z, point.z),
        )
        this.max = new Vector3(
            Math.max(this.max.x, point.x),
            Math.max(this.max.y, point.y),
            Math.max(this.max.z, point.z),
        )
    }

    contains(point: Vector3): boolean {
        return (
            point.x >= this.min.x && point.x <= this.max.x
            && point.y >= this.min.y && point.y <= this.max.y
            && point.z >= this.min.z && point.z <= this.max.z
        )
    }
}

export default Box
