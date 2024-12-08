import {
    Inject, Module, ModuleDecorator, Physics3D,
} from '@wasd/wasd'
import OfficeWorld from './OfficeWorld'

@ModuleDecorator()
export default class WorldManagerModule implements Module {
    private defaultWorld: Physics3D.World

    constructor(
        @Inject(Physics3D.PhysicsModule) private physics: Physics3D.PhysicsModule,
    ) {
        const boundary = new Physics3D.Box(
            new Physics3D.Vector3(-1000, -1000, -1000),
            new Physics3D.Vector3(1000, 1000, 1000),
        )

        this.defaultWorld = new OfficeWorld(boundary)
    }

    onLoad(): Promise<void> | void {
        this.physics.addWorld(this.defaultWorld)
    }

    getDefaultWorld(): Physics3D.World {
        return this.defaultWorld
    }
}
