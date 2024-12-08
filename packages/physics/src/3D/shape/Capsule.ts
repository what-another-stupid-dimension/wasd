import Vector3 from '../geometry/Vector3'
import Box from './Box'

class Capsule {
    constructor(public position: Vector3, public radius: number, public height: number) {}

    getEndPoints(): [Vector3, Vector3] {
        const halfHeight = new Vector3(0, this.height / 2, 0)
        return [
            this.position.add(halfHeight),
            this.position.subtract(halfHeight),
        ]
    }

    getBoundingBox(): Box {
        const [end1, end2] = this.getEndPoints()
        const min = new Vector3(
            Math.min(end1.x, end2.x) - this.radius,
            Math.min(end1.y, end2.y) - this.radius,
            Math.min(end1.z, end2.z) - this.radius,
        )
        const max = new Vector3(
            Math.max(end1.x, end2.x) + this.radius,
            Math.max(end1.y, end2.y) + this.radius,
            Math.max(end1.z, end2.z) + this.radius,
        )
        return new Box(min, max)
    }

    serialize(): object {
        return {
            position: this.position.toArray(),
            radius: this.radius,
            height: this.height,
        }
    }
}

export default Capsule
