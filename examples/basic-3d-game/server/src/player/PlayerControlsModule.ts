/* eslint-disable no-param-reassign */
import {
    Cli, CliNamespace, Inject, Module, ModuleDecorator,
    NetworkClient,
    OnClient,
    NetworkModule,
    Physics3D,
} from '@wasd/wasd'
import { PlayerEvents } from '@shared/events'
import PlayerModule from './PlayerModule'
import { PlayerControls } from './types'

const PLAYER_ACCELERATION = 8
const PLAYER_DECELERATION = 14
const PLAYER_MAX_SPEED = 1.42 * 4 // Average walking speed in m/s

@ModuleDecorator()
export default class PlayerControlsModule implements Module {
    private cli: Cli

    constructor(
        @Inject(PlayerModule) private players: PlayerModule,
        @Inject(NetworkModule) private network: NetworkModule,
        @Inject(Cli) cli: Cli,
    ) {
        this.cli = cli.createChild(CliNamespace.createElement('Player Controls', { fontColor: 'red' }))
    }

    onLoad(): void {
        this.cli.logInfo('Loaded')
        this.network.registerClientEvent(PlayerEvents.SetPlayerControlsNetworkEvent)
    }

    onUpdate(tick: number, deltaTime: number): void {
        this.players.getAllEntities().forEach((playerEntity) => {
            const inputDirection = this.getInputDirection(playerEntity.controls)

            if (inputDirection.isZero()) {
                this.stopMovementIfNoInput(playerEntity, deltaTime)
            } else {
                const newVelocity = this.updateVelocity(
                    playerEntity.velocity,
                    inputDirection,
                    deltaTime,
                )
                playerEntity.velocity = this.clampVelocity(newVelocity)
            }
        })
    }

    @OnClient(PlayerEvents.SetPlayerControlsNetworkEvent)
    onSetPlayerControls(
        event: PlayerEvents.SetPlayerControlsNetworkEvent,
        client: NetworkClient,
    ): void {
        const playerEntity = this.players.getClientEntity(client)
        if (!playerEntity) {
            this.cli.logError(`PlayerEntity not found for ${client.getIdentifier()}`)
            return
        }

        this.cli.logDebug(`Updated controls for ${playerEntity.name}`)
        playerEntity.controls = event.controls
    }

    private stopMovementIfNoInput(
        playerEntity: { velocity: Physics3D.Vector3 },
        deltaTime: number,
    ): void {
        const deceleration = PLAYER_DECELERATION * deltaTime

        // Reduce velocity in the x direction
        if (playerEntity.velocity.x > 0) {
            playerEntity.velocity.x = Math.max(playerEntity.velocity.x - deceleration, 0)
        } else if (playerEntity.velocity.x < 0) {
            playerEntity.velocity.x = Math.min(playerEntity.velocity.x + deceleration, 0)
        }

        // Reduce velocity in the y direction
        if (playerEntity.velocity.y > 0) {
            playerEntity.velocity.y = Math.max(playerEntity.velocity.y - deceleration, 0)
        } else if (playerEntity.velocity.y < 0) {
            playerEntity.velocity.y = Math.min(playerEntity.velocity.y + deceleration, 0)
        }

        // Reduce velocity in the z direction (if needed for 3D movement)
        if (playerEntity.velocity.z > 0) {
            playerEntity.velocity.z = Math.max(playerEntity.velocity.z - deceleration, 0)
        } else if (playerEntity.velocity.z < 0) {
            playerEntity.velocity.z = Math.min(playerEntity.velocity.z + deceleration, 0)
        }
    }

    private getInputDirection(controls: PlayerControls): Physics3D.Vector3 {
        const direction = new Physics3D.Vector3(0, 0, 0)

        if (controls.up) direction.z -= 1
        if (controls.down) direction.z += 1
        if (controls.right) direction.x += 1
        if (controls.left) direction.x -= 1

        return direction.normalize() // Normalize to prevent diagonal speed boost
    }

    private updateVelocity(
        currentVelocity: Physics3D.Vector3,
        inputDirection: Physics3D.Vector3,
        deltaTime: number,
    ): Physics3D.Vector3 {
        const acceleration = inputDirection.scale(PLAYER_ACCELERATION * deltaTime)
        return currentVelocity.add(acceleration)
    }

    private clampVelocity(velocity: Physics3D.Vector3): Physics3D.Vector3 {
        const speed = velocity.length()
        if (speed > PLAYER_MAX_SPEED) {
            return velocity.scale(PLAYER_MAX_SPEED / speed)
        }
        return velocity
    }
}
