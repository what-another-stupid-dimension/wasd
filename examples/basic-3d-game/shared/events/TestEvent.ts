class TestEvent {
    static name = 'hello'

    constructor(
        public message: string,
    ) {}

    serialize() {
        return { message: this.message }
    }

    static deserialize(data: string): TestEvent {
        return new TestEvent(JSON.parse(data).message)
    }
}

export default TestEvent
