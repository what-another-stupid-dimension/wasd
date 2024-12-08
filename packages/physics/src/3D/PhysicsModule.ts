import { Cli, CliNamespace } from '@wasd/cli'
import { InjectOptional } from '@wasd/di'
import { Module, ModuleDecorator } from '@wasd/modules'
import { World, WorldConstructor } from './world'

@ModuleDecorator()
export default class PhysicsModule implements Module {
    private cli: Cli

    private worlds: Map<WorldConstructor<World>, World> = new Map()

    constructor(
        @InjectOptional(Cli) cli: Cli = new Cli(),
    ) {
        this.cli = cli.createChild(CliNamespace.createElement('Physics', { fontColor: 'magenta' }))
    }

    onStart() {
        this.cli.logInfo('Physics module started.')
    }

    onUpdate(tick: number, deltaTime: number): Promise<void> | void {
        this.updateWorlds(deltaTime)
    }

    addWorld<T extends World>(world: T): void {
        this.worlds.set(world.constructor as WorldConstructor<T>, world)
        this.cli.logInfo(`Added world ${world.constructor.name}.`)
    }

    getWorld<T extends World>(world: WorldConstructor<T>): T | undefined {
        return this.worlds.get(world) as T
    }

    hasWorld<T extends World>(world: T): boolean {
        return this.worlds.has(world.constructor as WorldConstructor<T>)
    }

    removeWorld<T extends World>(world: T): void {
        this.worlds.delete(world.constructor as WorldConstructor<T>)
        this.cli.logInfo(`Removed world ${world.constructor.name}.`)
    }

    private updateWorlds(deltaTime: number) {
        this.worlds.forEach((world) => {
            world.update(deltaTime)
        })
    }
}
