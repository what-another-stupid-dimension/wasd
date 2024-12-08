import Vector3 from '../geometry/Vector3'

class Plate {
    constructor(public min: Vector3, public max: Vector3) {}

    getVertices(): Vector3[] {
        // Creates vertices for a flat plate along the xy plane with negligible z thickness
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

    serialize(): object {
        return {
            min: this.min.toArray(),
            max: this.max.toArray(),
        }
    }
}

export default Plate
