import Vector2 from '../geometry/Vector2'

class Plate {
    constructor(public min: Vector2, public max: Vector2) {}

    getVertices(): Vector2[] {
        return [
            new Vector2(this.min.x, this.min.y),
            new Vector2(this.max.x, this.min.y),
            new Vector2(this.max.x, this.max.y),
            new Vector2(this.min.x, this.max.y),
        ]
    }

    expandToFit(point: Vector2): void {
        this.min = new Vector2(
            Math.min(this.min.x, point.x),
            Math.min(this.min.y, point.y),
        )
        this.max = new Vector2(
            Math.max(this.max.x, point.x),
            Math.max(this.max.y, point.y),
        )
    }
}

export default Plate
