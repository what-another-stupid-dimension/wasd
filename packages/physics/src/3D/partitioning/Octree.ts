import { AABB } from '../collision'
import { Body } from '../body'
import { Vector3 } from '../geometry'
import { Box } from '../shape'

class Octree {
    private boundary: Box

    private capacity: number

    private bodies: Body[]

    private divided: boolean

    private children: Octree[]

    constructor(boundary: Box, capacity: number = 8) {
        this.boundary = boundary
        this.capacity = capacity
        this.bodies = []
        this.divided = false
        this.children = []
    }

    // Method to insert an body into the octree
    insert(body: Body): boolean {
        if (!this.boundary.contains(body.position)) return false

        if (this.bodies.length < this.capacity) {
            this.bodies.push(body)
            return true
        }

        if (!this.divided) this.subdivide()

        // Directly insert into a child octree
        // eslint-disable-next-line no-restricted-syntax
        for (const child of this.children) {
            if (child.insert(body)) return true
        }

        return false
    }

    // Subdivide the octree into 8 children
    private subdivide(): void {
        const { min, max } = this.boundary
        const mid = min.add(max).multiply(0.5)

        const createChildOctree = (
            newMin: Vector3,
            newMax: Vector3,
        ) => new Octree(new Box(newMin, newMax))

        this.children = [
            createChildOctree(min, mid),
            createChildOctree(new Vector3(mid.x, min.y, min.z), new Vector3(max.x, mid.y, mid.z)),
            createChildOctree(new Vector3(mid.x, mid.y, min.z), new Vector3(max.x, max.y, mid.z)),
            createChildOctree(new Vector3(min.x, mid.y, min.z), new Vector3(mid.x, max.y, mid.z)),
            createChildOctree(new Vector3(min.x, min.y, mid.z), new Vector3(mid.x, mid.y, max.z)),
            createChildOctree(new Vector3(mid.x, min.y, mid.z), new Vector3(max.x, mid.y, max.z)),
            createChildOctree(mid, max),
            createChildOctree(new Vector3(min.x, mid.y, mid.z), new Vector3(mid.x, max.y, max.z)),
        ]

        // Insert each body into the correct child octree
        this.bodies.forEach((body) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const child of this.children) {
                if (child.insert(body)) return
            }
        })
        this.bodies = []
        this.divided = true
    }

    // Query the octree for bodies within a specific range
    query(
        range: Box,
        callback: (body: Body) => boolean = () => true,
    ): Body[] {
        const found: Body[] = []

        // Check if this Octree's boundary intersects with the query range
        if (!AABB.intersects(this.boundary, range)) return found

        if (!this.divided) {
            this.bodies.forEach((body) => {
                if (range.contains(body.position) && callback(body)) {
                    found.push(body)
                }
            })
        } else {
            // Otherwise, query bodies in the children
            this.children.forEach((child) => {
                found.push(...child.query(range, callback))
            })
        }

        return found
    }

    // Method to update the octree, called every tick to update bodies
    update(parent?: Octree): void {
        // Process every body, checking if it needs to be moved
        this.bodies.forEach((body) => {
            if (!this.boundary.contains(body.position)) {
                this.removebody(body)
                // If the current octree is out of boundary, recursively insert into the parent octree.
                if (parent) {
                    parent.insert(body)
                } else {
                    this.insert(body) // Reinsert into the correct position
                }
            }
        })

        // Update children recursively
        if (this.divided) {
            this.children.forEach((child) => {
                child.update(this) // Pass current octree as parent for recursive movement
            })
        }
    }

    // Remove an body from the octree
    private removebody(body: Body): void {
        const index = this.bodies.indexOf(body)
        if (index !== -1) {
            this.bodies.splice(index, 1)
        }

        if (this.divided) {
            this.children.forEach((child) => child.removebody(body))
        }
    }

    // Method to move an body and reinsert it into the correct place
    movebody(body: Body): void {
        if (!this.boundary.contains(body.position)) {
            this.removebody(body)
            this.insert(body)
        }
    }
}

export default Octree
