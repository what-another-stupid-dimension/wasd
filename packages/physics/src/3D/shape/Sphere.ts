import Vector3 from '../geometry/Vector3'
import Box from './Box'

class Sphere {
    constructor(public position: Vector3, public radius: number) {}

    getBoundingBox(): Box {
        const min = new Vector3(
            this.position.x - this.radius,
            this.position.y - this.radius,
            this.position.z - this.radius,
        )
        const max = new Vector3(
            this.position.x + this.radius,
            this.position.y + this.radius,
            this.position.z + this.radius,
        )
        return new Box(min, max)
    }

    serialize(): object {
        return {
            position: this.position.toArray(),
            radius: this.radius,
        }
    }
}

export default Sphere
