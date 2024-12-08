import { v4 as uuidv4 } from 'uuid'

export default abstract class NetworkClient {
    private identifier: string

    private sessionData: Map<Symbol, any> = new Map()

    constructor(public address: string, public port: number) {
        this.identifier = uuidv4()
    }

    abstract sendMessage(message: string | ArrayBuffer): void

    abstract emit(event: string, data: any): void

    getIdentifier(): string {
        return this.identifier
    }

    hasSessionData(key: Symbol): boolean {
        return this.sessionData.has(key)
    }

    setSessionData(key: Symbol, value: any): void {
        this.sessionData.set(key, value)
    }

    getSessionData(key: Symbol): any {
        return this.sessionData.get(key)
    }
}
