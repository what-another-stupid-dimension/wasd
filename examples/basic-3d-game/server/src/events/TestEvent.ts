import { Event } from '@wasd/events'

export default class TestEvent implements Event {
    constructor(public message: string) {}
}
