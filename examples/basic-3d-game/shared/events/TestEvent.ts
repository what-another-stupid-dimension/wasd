import type { NetworkEvent } from '@wasd/network'

class TestEvent implements NetworkEvent {
    static eventName = 'hello'

    constructor(
        public message: string,
    ) {
    }

    serialize() {
        return JSON.stringify({ message: this.message })
    }

    static deserialize(data: string): TestEvent {
        return new TestEvent(JSON.parse(data).message)
    }
}

export default TestEvent
