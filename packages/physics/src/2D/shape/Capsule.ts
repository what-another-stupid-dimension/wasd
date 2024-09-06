import Vector2 from '../geometry/Vector2'

class Capsule {
    constructor(public position: Vector2, public radius: number, public height: number) {}

    getEndPoints(): [Vector2, Vector2] {
        const halfHeight = new Vector2(0, this.height / 2)
        return [
            this.position.add(halfHeight),
            this.position.subtract(halfHeight),
        ]
    }
}

export default Capsule
