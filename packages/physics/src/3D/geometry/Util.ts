import { Polygon } from '../shape'
import Vector3 from './Vector3'

class Util {
    public static closestPointOnLineSegment(p: Vector3, a: Vector3, b: Vector3): Vector3 {
        const ab = b.subtract(a)
        const t = Math.max(0, Math.min(1, p.subtract(a).dot(ab) / ab.dot(ab)))
        return a.add(ab.multiply(t))
    }

    public static closestPointOnPolygon(point: Vector3, polygon: Polygon): Vector3 {
        let closestPoint = polygon.vertices[0]
        let minDistance = Vector3.distance(point, polygon.vertices[0])

        for (let i = 0; i < polygon.vertices.length; i += 1) {
            const a = polygon.vertices[i]
            const b = polygon.vertices[(i + 1) % polygon.vertices.length]
            const pointOnEdge = Util.closestPointOnLineSegment(point, a, b)
            const distance = Vector3.distance(pointOnEdge, point)

            if (distance < minDistance) {
                minDistance = distance
                closestPoint = pointOnEdge
            }
        }

        return closestPoint
    }
}

export default Util
