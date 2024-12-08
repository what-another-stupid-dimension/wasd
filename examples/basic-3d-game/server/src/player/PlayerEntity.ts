import { Physics3D } from '@wasd/wasd'

type PlayerEntityOptions = {
    position: Physics3D.Vector3
    world: Physics3D.World
    name: string
}

class PlayerEntity extends Physics3D.RigidBody {
    private world: Physics3D.World

    public name: string

    public model: string = 'player'

    public controls: {
        up: boolean,
        right: boolean,
        down: boolean,
        left: boolean,
    }

    // WebRTC-specific fields
    public webRTCConnection: RTCPeerConnection | null = null

    public localDescription: RTCSessionDescriptionInit | null = null

    public remoteDescription: RTCSessionDescriptionInit | null = null

    public iceCandidates: RTCIceCandidateInit[] = []

    constructor({
        position,
        world,
        name,
    }: PlayerEntityOptions) {
        super({
            collider: new Physics3D.Collider(
                new Physics3D.Box(
                    new Physics3D.Vector3(-1, -1, -1),
                    new Physics3D.Vector3(1, 1, 1),
                ),
                new Physics3D.ColliderMaterial(0.5, 0.5),
            ),
            mass: 1,
            position,
        })

        this.world = world
        this.world.addEntity(this)

        this.name = name

        this.controls = {
            up: false, down: false, right: false, left: false,
        }
    }

    setWorld(world: Physics3D.World): void {
        this.world.removeEntity(this)
        this.world = world
        this.world.addEntity(this)
    }

    getWorld(): Physics3D.World {
        return this.world
    }

    update(deltaTime: number): void {
        super.update(deltaTime)
    }

    // WebRTC methods
    setWebRTCConnection(connection: RTCPeerConnection): void {
        this.webRTCConnection = connection
    }

    setLocalDescription(description: RTCSessionDescriptionInit): void {
        this.localDescription = description
    }

    setRemoteDescription(description: RTCSessionDescriptionInit): void {
        this.remoteDescription = description
    }

    addIceCandidate(candidate: RTCIceCandidateInit): void {
        this.iceCandidates.push(candidate)
    }

    serialize(): object {
        return {
            ...super.serialize(),
            name: this.name,
            model: this.model,
            webRTC: {
                localDescription: this.localDescription,
                remoteDescription: this.remoteDescription,
                iceCandidates: this.iceCandidates,
            },
        }
    }
}

export default PlayerEntity
