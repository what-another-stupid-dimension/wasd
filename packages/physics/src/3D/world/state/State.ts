import StateDiff from './StateDiff'
import { createHash } from './stateHash'

export default class State<T> {
    private entities: T[]

    private entityHashes: Map<string, string>

    constructor(entities: T[]) {
        this.entities = entities
        this.entityHashes = new Map(
            entities.map((entity: any) => [entity.id, createHash(entity.serialize())]),
        )
    }

    serialize(): any[] {
        return this.entities.map((entity: any) => entity.serialize())
    }

    isEqual(newState: State<T>): boolean {
        if (this.entityHashes.size !== newState.entityHashes.size) return false
        return Array.from(this.entityHashes).every(
            ([id, hash]) => newState.entityHashes.get(id) === hash,
        )
    }

    calculateDiffs(previousState: State<T>): StateDiff<T> | null {
        const updates = this.entities.filter((entity: any) => {
            const previousHash = previousState.entityHashes.get(entity.id)
            const currentHash = createHash(entity.serialize())
            return previousHash && previousHash !== currentHash
        })

        const added = this.entities.filter(
            (entity: any) => !previousState.entityHashes.has(entity.id),
        )

        const removed = Array.from(previousState.entityHashes.keys()).filter(
            (id) => !this.entityHashes.has(id),
        )

        return new StateDiff(updates, added, removed, createHash(previousState.serialize()))
    }
}
