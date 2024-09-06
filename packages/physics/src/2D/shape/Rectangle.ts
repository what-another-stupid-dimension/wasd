import Vector2 from '../geometry/Vector2'

class Rectangle {
    constructor(public position: Vector2, public width: number, public height: number) {}

    getVertices(): Vector2[] {
        const halfWidth = this.width / 2
        const halfHeight = this.height / 2
        return [
            this.position.add(new Vector2(-halfWidth, -halfHeight)),
            this.position.add(new Vector2(halfWidth, -halfHeight)),
            this.position.add(new Vector2(halfWidth, halfHeight)),
            this.position.add(new Vector2(-halfWidth, halfHeight)),
        ]
    }
}

export default Rectangle
