import SharedNetworkEvent from './SharedNetworkEvent'

class TestEvent extends SharedNetworkEvent {
    static eventName = 'test'

    constructor(public message: string) { super() }
}

export default TestEvent
