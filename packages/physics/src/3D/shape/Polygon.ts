import Vector3 from '../geometry/Vector3'
import Box from './Box'

class Polygon {
    constructor(public position: Vector3, public vertices: Vector3[]) {}

    getNormals(): Vector3[] {
        const normals: Vector3[] = []

        for (let i = 0; i < this.vertices.length; i += 1) {
            const v1 = this.vertices[i]
            const v2 = this.vertices[(i + 1) % this.vertices.length]
            const edge = v2.subtract(v1)
            normals.push(edge.normalize())
        }
        return normals
    }

    getBoundingBox(): Box {
        if (this.vertices.length === 0) return new Box(this.position, this.position)

        let min = this.vertices[0].add(this.position)
        let max = this.vertices[0].add(this.position)

        // eslint-disable-next-line no-restricted-syntax
        for (const vertex of this.vertices) {
            const worldVertex = vertex.add(this.position)
            min = new Vector3(
                Math.min(min.x, worldVertex.x),
                Math.min(min.y, worldVertex.y),
                Math.min(min.z, worldVertex.z),
            )
            max = new Vector3(
                Math.max(max.x, worldVertex.x),
                Math.max(max.y, worldVertex.y),
                Math.max(max.z, worldVertex.z),
            )
        }
        return new Box(min, max)
    }
}

export default Polygon
