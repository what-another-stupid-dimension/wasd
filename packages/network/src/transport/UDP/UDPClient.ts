import NetworkClient from '../NetworkClient'
import { Transport } from '../types'

class UDPClient<T extends Transport> extends NetworkClient<T> {
}

export default UDPClient
