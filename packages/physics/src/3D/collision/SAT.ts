import Vector3 from '../geometry/Vector3'

class SAT {
    // Project vertices of a polygon onto an axis and return the min and max projection values
    static projectVertices(vertices: Vector3[], axis: Vector3): { min: number, max: number } {
        let min = axis.dot(vertices[0])
        let max = min
        for (let i = 1; i < vertices.length; i += 1) {
            const projection = axis.dot(vertices[i])
            if (projection < min) min = projection
            if (projection > max) max = projection
        }
        return { min, max }
    }

    // Check if two projections overlap
    static overlaps(
        proj1: { min: number, max: number },
        proj2: { min: number, max: number },
    ): boolean {
        return proj1.max >= proj2.min && proj2.max >= proj1.min
    }

    // Get the axis-aligned minimum translation vector (MTV) for penetration resolution
    static getOverlap(
        proj1: { min: number, max: number },
        proj2: { min: number, max: number },
    ): number {
        return Math.min(proj1.max - proj2.min, proj2.max - proj1.min)
    }

    // SAT check between two convex shapes
    static testCollision(
        verticesA: Vector3[],
        verticesB: Vector3[],
    ): { normal: Vector3, depth: number } | null {
        let minimumOverlap = Infinity
        let smallestAxis: Vector3 = new Vector3()

        // Get all unique edge normals for both shapes
        const axes = [...SAT.getNormals(verticesA), ...SAT.getNormals(verticesB)]

        // eslint-disable-next-line no-restricted-syntax
        for (const axis of axes) {
            const projectionA = SAT.projectVertices(verticesA, axis)
            const projectionB = SAT.projectVertices(verticesB, axis)

            if (!SAT.overlaps(projectionA, projectionB)) {
                return null // No collision, separating axis found
            }

            const overlap = SAT.getOverlap(projectionA, projectionB)
            if (overlap < minimumOverlap) {
                minimumOverlap = overlap
                smallestAxis = axis
            }
        }

        return {
            normal: smallestAxis.normalize(),
            depth: minimumOverlap,
        }
    }

    // Get normals from edges of a polygon (2D in 3D space)
    static getNormals(vertices: Vector3[]): Vector3[] {
        const normals: Vector3[] = []
        for (let i = 0; i < vertices.length; i += 1) {
            const v1 = vertices[i]
            const v2 = vertices[(i + 1) % vertices.length]
            const edge = v2.subtract(v1)
            normals.push(new Vector3(-edge.y, edge.x, edge.z).normalize()) // Perpendicular normal
        }
        return normals
    }
}

export default SAT
