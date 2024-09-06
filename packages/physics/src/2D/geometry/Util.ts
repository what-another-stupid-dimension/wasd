import { Polygon } from '../shape'
import Vector2 from './Vector2'

class Util {
    public static closestPointOnLineSegment(p: Vector2, a: Vector2, b: Vector2): Vector2 {
        const ab = b.subtract(a)
        const t = Math.max(0, Math.min(1, p.subtract(a).dot(ab) / ab.dot(ab)))
        return a.add(ab.multiply(t))
    }

    public static closestPointOnPolygon(point: Vector2, polygon: Polygon): Vector2 {
        let closestPoint = polygon.vertices[0]
        let minDistance = Vector2.distance(point, polygon.vertices[0])

        for (let i = 0; i < polygon.vertices.length; i += 1) {
            const a = polygon.vertices[i]
            const b = polygon.vertices[(i + 1) % polygon.vertices.length]
            const pointOnEdge = Util.closestPointOnLineSegment(point, a, b)
            const distance = Vector2.distance(pointOnEdge, point)

            if (distance < minDistance) {
                minDistance = distance
                closestPoint = pointOnEdge
            }
        }

        return closestPoint
    }
}

export default Util
