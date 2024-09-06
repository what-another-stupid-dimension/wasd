import NetworkClient from './NetworkClient'

export interface Transport {
    open(): void

    close(): void
}

export interface TransportCallbacks<T extends Transport> {
    onOpen: (name: string, port: number) => void,
    onClose: (name: string, port: number) => void,
    onError: (error: Error) => void,
    onClientMessage: (client: NetworkClient<T>, message: string) => void,
    onClientConnected: (client: NetworkClient<T>,) => void,
    onClientDisconnected: (client: NetworkClient<T>) => void,
    onClientError: (message: string) => void,
}

export type TransportConstructor<T extends Transport> = {
    new (
        port: number,
        callbacks: TransportCallbacks<T>,
    ): T;
};
