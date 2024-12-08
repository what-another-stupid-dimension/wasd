import State from './State'
import StateDiff from './StateDiff'

class StateManager<T extends { id: string; serialize: () => object }> {
    private entityStates: Map<string, State<T>>

    constructor() {
        this.entityStates = new Map()
    }

    addEntity(entity: T): void {
        if (!this.entityStates.has(entity.id)) {
            this.entityStates.set(entity.id, new State([]))
        }
    }

    removeEntity(entity: T): void {
        this.entityStates.delete(entity.id)
    }

    getStateForEntity(entity: T, entitiesInRange: T[]): { state: State<T>; hash: string } {
        let state = this.entityStates.get(entity.id)
        if (!state) {
            state = new State([])
            this.entityStates.set(entity.id, state)
        }
        const newState = new State(entitiesInRange)
        this.entityStates.set(entity.id, newState)
        return { state: newState, hash: newState.serialize().join(',') }
    }

    getStateDiffForEntity(entity: T, entitiesInRange: T[]): StateDiff<T> | null {
        const previousState = this.entityStates.get(entity.id)
        const newState = new State(entitiesInRange)

        if (!previousState || previousState.isEqual(newState)) {
            return null
        }

        this.entityStates.set(entity.id, newState)
        return newState.calculateDiffs(previousState)
    }
}

export default StateManager
