import { NetworkEvent } from '../event'

export interface Proxy {
    apply<T extends NetworkEvent>(event: T): Promise<T | false>
    accepts(event: NetworkEvent): boolean
}
