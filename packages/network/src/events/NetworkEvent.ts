import { Event } from '@wasd/events'

abstract class NetworkEvent implements Event {
    static name: string

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static deserialize(data: string): NetworkEvent {
        throw new Error('`static deserialize` must be implemented by subclasses.')
    }

    abstract serialize(): any
}

export default NetworkEvent
