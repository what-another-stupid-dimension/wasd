import { v4 as uuidv4 } from 'uuid'

export default abstract class NetworkClient<T> {
    private identifier: string

    constructor(public address: string, public port: number, public transport: T) {
        this.identifier = uuidv4()
    }

    getIdentifier(): string {
        return this.identifier
    }
}
