import Vector2 from '../geometry/Vector2'

class Polygon {
    constructor(public vertices: Vector2[], public position: Vector2) {}

    getNormals(): Vector2[] {
        const normals: Vector2[] = []

        for (let i = 0; i < this.vertices.length; i += 1) {
            const v1 = this.vertices[i]
            const v2 = this.vertices[(i + 1) % this.vertices.length]
            const edge = v2.subtract(v1)
            normals.push(new Vector2(-edge.y, edge.x).normalize())
        }
        return normals
    }
}
export default Polygon
