import { Body } from '../body'
import { Box } from '../shape'
import OctreeNode from './OctreeNode'

class Octree {
    root: OctreeNode

    constructor(boundary: Box, capacity: number = 8) {
        this.root = new OctreeNode(boundary, capacity)
    }

    getBoundary(): Box {
        return this.root.boundary
    }

    insertBody(body: Body): boolean {
        return this.root.insert(body)
    }

    removeBody(body: Body): boolean {
        return this.root.remove(body)
    }

    query(range: Box, callback: (body: Body) => boolean = () => true): Body[] {
        return this.root.query(range, callback)
    }

    update(): void {
        const bodiesToUpdate: Body[] = []
        this.root.query(this.root.boundary, (body) => {
            bodiesToUpdate.push(body)
            return true
        })

        bodiesToUpdate.forEach((body) => {
            this.root.updateBody(body)
        })
    }
}

export default Octree
