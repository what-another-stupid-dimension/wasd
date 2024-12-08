import World from './World'

export interface WorldConstructor<T extends World> {
    new (...args: any[]): T,
}
