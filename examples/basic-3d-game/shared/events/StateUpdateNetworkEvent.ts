export default class StateUpdateNetworkEvent {
    static name = 'stateUpdate'

    updated: any[] = []

    added: any[] = []

    removed: string[] = []

    hash: string

    constructor(
        public diff: {
            updated: any[],
            added: any[],
            removed: string[],
            hash: string,
        },
        public focus: string,
    ) {
        this.updated = diff.updated
        this.added = diff.added
        this.removed = diff.removed
        this.hash = diff.hash
    }

    serialize() {
        return {
            updated: this.updated,
            added: this.added,
            removed: this.removed,
            hash: this.hash,
            focus: this.focus,
        }
    }

    static deserialize(data: string) {
        const parsed = JSON.parse(data)
        return new StateUpdateNetworkEvent({ ...parsed }, parsed.focus)
    }
}
