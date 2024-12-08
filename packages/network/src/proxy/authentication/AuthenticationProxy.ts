/* eslint-disable @typescript-eslint/no-unused-vars */
import { NetworkClient } from '../../client'
import { NetworkEvent, NetworkEventConstructor } from '../../events'
import { Proxy } from '../types'

type Props = {
    ignoreEvents?: NetworkEventConstructor<NetworkEvent>[],
}
// TODO Implement Authentication Methods like SSO, OAuth, etc.
class AuthenticationProxy implements Proxy {
    private ignoreEvents: NetworkEventConstructor<NetworkEvent>[]

    constructor({
        ignoreEvents = [],
    }: Props = {}) {
        this.ignoreEvents = ignoreEvents
    }

    async apply(event: NetworkEvent, client: NetworkClient): Promise<NetworkEvent | false> {
        if (this.isAuthenticationEvent(event)) {
            this.authenticate(client, event)
        }

        if (this.isAuthorized(client)) {
            return event
        }

        return false
    }

    accepts(event: NetworkEvent): boolean {
        if (this.ignoreEvents.includes(
            event.constructor as NetworkEventConstructor<NetworkEvent>,
        )) {
            return false
        }
        return true
    }

    private isAuthorized(_client: NetworkClient): boolean {
        return true
    }

    private authenticate(_client: NetworkClient, _event: NetworkEvent): boolean {
        return false
    }

    private isAuthenticationEvent(_event: NetworkEvent): boolean {
        return false
    }
}

export default AuthenticationProxy
