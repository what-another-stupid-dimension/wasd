import { Event } from '@wasd/events'

abstract class NetworkEvent implements Event {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static deserialize(data: string): NetworkEvent {
        throw new Error('`static deserialize` must be implemented by subclasses.')
    }

    abstract serialize(): string
}

export default NetworkEvent
