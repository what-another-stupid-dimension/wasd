import { v4 as uuidv4 } from 'uuid'

export default abstract class NetworkClient {
    private identifier: string

    constructor(public address: string, public port: number) {
        this.identifier = uuidv4()
    }

    getIdentifier(): string {
        return this.identifier
    }

    isAuthenticated() {
        return false
    }
}
