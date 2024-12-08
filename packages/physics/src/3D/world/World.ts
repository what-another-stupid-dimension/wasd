import { Octree } from '../partitioning'
import { Box } from '../shape'
import StateManager from './state/StateManager'
import { Body } from '../body'
import { CollisionDetection, CollisionResolving } from '../collision'

class World {
    private stateManager: StateManager<Body>

    octree: Octree

    constructor(boundary: Box, capacity: number = 8) {
        this.octree = new Octree(boundary, capacity)
        this.stateManager = new StateManager<Body>()
    }

    addEntity(body: Body): boolean {
        const inserted = this.octree.insertBody(body)
        if (inserted) {
            this.stateManager.addEntity(body)
        }
        return inserted
    }

    removeEntity(body: Body): void {
        this.octree.removeBody(body)
        this.stateManager.removeEntity(body)
    }

    queryEntities(range: Box, callback?: (body: Body) => boolean): Body[] {
        return this.octree.query(range, callback)
    }

    getStateForEntity(entity: Body, range: Box): { state: any; hash: string } {
        const entities = this.queryEntities(range)
        return this.stateManager.getStateForEntity(entity, entities)
    }

    getStateDiffForEntity(entity: Body, range: Box): any | null {
        const entities = this.queryEntities(range)
        return this.stateManager.getStateDiffForEntity(entity, entities)
    }

    update(deltaTime: number): void {
        const bodies = this.octree.query(this.octree.getBoundary())

        bodies.forEach((body) => {
            if (!body.isStatic) {
                body.update(deltaTime, this.octree.getBoundary())
            }
        })

        bodies.forEach((body) => {
            const nearbyBodies = this.octree.query(body.getBoundingBox())
            nearbyBodies.forEach((otherBody) => {
                if (body !== otherBody) {
                    const collision = CollisionDetection.detectCollision(body, otherBody)
                    if (collision) {
                        CollisionResolving.resolveCollision(body, otherBody, collision)
                    }
                }
            })
        })

        this.octree.update()
    }
}

export default World
