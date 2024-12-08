/* eslint-disable no-restricted-syntax */
import { AABB } from '../collision'
import { Body } from '../body'
import { Vector3 } from '../geometry'
import { Box } from '../shape'

class OctreeNode {
    boundary: Box

    capacity: number

    bodies: Body[]

    children: OctreeNode[] | null

    constructor(boundary: Box, capacity: number = 8) {
        this.boundary = boundary
        this.capacity = capacity
        this.bodies = []
        this.children = null
    }

    isLeaf(): boolean {
        return this.children === null
    }

    subdivide(): void {
        const { min, max } = this.boundary
        const mid = min.add(max).multiply(0.5)

        const createChildNode = (
            newMin: Vector3,
            newMax: Vector3,
        ) => new OctreeNode(new Box(newMin, newMax), this.capacity)

        this.children = [
            createChildNode(min, mid),
            createChildNode(new Vector3(mid.x, min.y, min.z), new Vector3(max.x, mid.y, mid.z)),
            createChildNode(new Vector3(mid.x, mid.y, min.z), new Vector3(max.x, max.y, mid.z)),
            createChildNode(new Vector3(min.x, mid.y, min.z), new Vector3(mid.x, max.y, mid.z)),
            createChildNode(new Vector3(min.x, min.y, mid.z), new Vector3(mid.x, mid.y, max.z)),
            createChildNode(new Vector3(mid.x, min.y, mid.z), new Vector3(max.x, mid.y, max.z)),
            createChildNode(mid, max),
            createChildNode(new Vector3(min.x, mid.y, mid.z), new Vector3(mid.x, max.y, max.z)),
        ]
    }

    merge(): void {
        if (!this.children) return
        this.children.forEach((child) => {
            this.bodies.push(...child.bodies)
        })
        this.children = null
    }

    insert(body: Body): boolean {
        if (!this.boundary.contains(body.position)) return false

        if (this.isLeaf() && this.bodies.length < this.capacity) {
            this.bodies.push(body)
            return true
        }

        if (this.isLeaf()) this.subdivide()

        for (const child of this.children!) {
            if (child.insert(body)) return true
        }

        return false
    }

    remove(body: Body): boolean {
        const index = this.bodies.indexOf(body)
        if (index !== -1) {
            this.bodies.splice(index, 1)
            return true
        }

        if (!this.isLeaf()) {
            for (const child of this.children!) {
                if (child.remove(body)) return true
            }
        }

        return false
    }

    query(range: Box, callback: (body: Body) => boolean = () => true): Body[] {
        const found: Body[] = []

        if (!AABB.intersects(this.boundary, range)) return found

        this.bodies.forEach((body) => {
            if (range.contains(body.position) && callback(body)) {
                found.push(body)
            }
        })

        if (!this.isLeaf()) {
            this.children!.forEach((child) => {
                found.push(...child.query(range, callback))
            })
        }

        return found
    }

    updateBody(body: Body): boolean {
        if (!this.remove(body)) return false
        return this.insert(body)
    }
}

export default OctreeNode
