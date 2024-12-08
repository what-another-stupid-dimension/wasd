export default class SetPlayerControlsNetworkEvent {
    static name = 'playerControls:set'

    constructor(public controls: {
        up: boolean,
        right: boolean,
        down: boolean,
        left: boolean,
    }) {}

    serialize() {
        return this.controls
    }

    static deserialize(data: any) {
        return new SetPlayerControlsNetworkEvent(data)
    }
}
