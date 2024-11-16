export interface NetworkEventConstructor<T> {
    new (...args: any[]): T,
    deserialize(data: string): T
    eventName: string
}
