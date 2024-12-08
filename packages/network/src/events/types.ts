import { NetworkClient } from '../client'
import NetworkEvent from './NetworkEvent'

export interface NetworkEventConstructor<T extends NetworkEvent> {
    new (...args: any[]): T,
    deserialize(data: string, client: NetworkClient): T
    name: string
}
