export default class StateDiff<T> {
    constructor(
        private updated: T[],
        private added: T[],
        private removed: string[],
        private hash: string,
    ) {}

    serialize(): { updated: any[]; added: any[]; removed: string[]; hash: string } {
        return {
            updated: this.updated.map((diff: any) => diff.serialize()),
            added: this.added.map((entity: any) => entity.serialize()),
            removed: this.removed,
            hash: this.hash,
        }
    }

    isEmpty(): boolean {
        return this.updated.length === 0 && this.added.length === 0 && this.removed.length === 0
    }
}
