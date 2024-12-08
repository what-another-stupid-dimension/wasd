import NetworkClient from '../client/NetworkClient'

export interface Transport {
    open(): void

    close(): void

    broadcast(message: string): void
}

export interface TransportCallbacks {
    onOpen: (name: string, port: number) => void,
    onClose: (name: string, port: number) => void,
    onError: (error: Error) => void,
    onClientMessage: (client: NetworkClient, message: string) => void,
    onClientConnected: (client: NetworkClient,) => void,
    onClientDisconnected: (client: NetworkClient) => void,
    onClientError: (message: string) => void,
}

export type TransportConstructor<T extends Transport> = {
    new (
        port: number,
        callbacks: TransportCallbacks,
    ): T;
};
