export default class InitialStateNetworkEvent {
    static name = 'initialState'

    constructor(
        public state: any,
        public hash: string,
        public focus: string,
    ) {}

    serialize() {
        return {
            state: this.state,
            hash: this.hash,
            focus: this.focus,
        }
    }

    static deserialize(data: string) {
        const parsed = JSON.parse(data)
        return new InitialStateNetworkEvent(parsed.state, parsed.hash, parsed.focus)
    }
}
