/* eslint-disable max-lines-per-function */
import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import {
    Vector3, Vector2, Box2, MathUtils,
} from 'three'
import { useNetwork } from '../network'

const useStateCamera = ({
    tiltAngle = { min: 35, max: 55 },
    deadZone = { width: 1, height: 1 },
    minDistance = 8,
    maxDistance = 32,
}: {
    tiltAngle?: { min: number; max: number };
    deadZone?: { width: number; height: number };
    minDistance?: number;
    maxDistance?: number;
}) => {
    const { bindNetworkEvent, unbindNetworkEvent } = useNetwork()
    const { camera, scene, gl } = useThree()
    const targetRef = useRef<Vector3>(new Vector3(0, 0, 0)) // Target focus position
    const currentFocus = useRef<Vector3>(new Vector3(0, 0, 0)) // Smooth focus position
    const distanceRef = useRef<number>(15) // Current camera distance
    const currentTiltRadiansRef = useRef<number>((40 * Math.PI) / 180) // Initial tilt angle in radians

    const deadZoneBox = useRef<Box2>(new Box2())

    useEffect(() => {
        const updateFocus = (entityId: string) => {
            const entity = scene.getObjectByName(entityId)
            if (entity) {
                targetRef.current.copy(entity.position)
            }
        }

        const onInitialState = (data: any) => {
            if (data.focus) {
                updateFocus(data.focus)
            }
        }

        const onStateUpdate = (data: any) => {
            if (data.focus) {
                updateFocus(data.focus)
            }
        }

        bindNetworkEvent('stateUpdate', onStateUpdate)
        bindNetworkEvent('initialState', onInitialState)

        return () => {
            unbindNetworkEvent('stateUpdate', onStateUpdate)
            unbindNetworkEvent('initialState', onInitialState)
        }
    }, [bindNetworkEvent, unbindNetworkEvent, scene])

    useEffect(() => {
        const handleWheel = (event: { deltaY: number }) => {
            const delta = event.deltaY * 0.05
            distanceRef.current = Math.max(
                minDistance,
                Math.min(maxDistance, distanceRef.current + delta),
            )
        }

        gl.domElement.addEventListener('wheel', handleWheel)
        return () => {
            gl.domElement.removeEventListener('wheel', handleWheel)
        }
    }, [gl, minDistance, maxDistance])

    useFrame(() => {
        const target = targetRef.current.clone()
        const { current } = currentFocus
        const distance = distanceRef.current

        // Smooth out target updates inside the camera
        targetRef.current.lerp(target, 0.1) // Smoother target transitions for the camera

        // Interpolate tilt angle based on distance
        const targetTiltAngle = tiltAngle.min
        + ((distance - minDistance) / (maxDistance - minDistance))
        * (tiltAngle.max - tiltAngle.min)
        const targetTiltRadians = (targetTiltAngle * Math.PI) / 180

        // Smooth the tilt angle transition
        currentTiltRadiansRef.current = MathUtils.lerp(
            currentTiltRadiansRef.current,
            targetTiltRadians,
            0.1, // Smoothing factor for tilt transitions
        )

        const currentTiltRadians = currentTiltRadiansRef.current

        // Calculate camera position for top-down view with tilt
        const height = distance * Math.sin(currentTiltRadians)
        const zOffset = distance * Math.cos(currentTiltRadians)

        const cameraPosition = new Vector3(
            current.x, // Centered along X-axis
            current.y + height, // Adjust height based on tilt
            current.z + zOffset, // Correct Z offset for proper alignment
        )

        // Smooth out focus position
        current.lerp(target, 0.1)

        // Update the dead zone to reduce over-sensitivity
        const deadZoneHalfWidth = deadZone.width / 2
        const deadZoneHalfHeight = deadZone.height / 2
        deadZoneBox.current.set(
            new Vector2(current.x - deadZoneHalfWidth, current.z - deadZoneHalfHeight),
            new Vector2(current.x + deadZoneHalfWidth, current.z + deadZoneHalfHeight),
        )

        // Ensure camera follows when the target leaves the dead zone
        const targetPosition2D = new Vector2(target.x, target.z)
        if (!deadZoneBox.current.containsPoint(targetPosition2D)) {
            currentFocus.current.lerp(target, 0.05) // Smoothly follow the target
        }

        // Smoothly move the camera to the calculated position
        camera.position.lerp(cameraPosition, 0.2)

        // Smoothly apply the tilt angle to the camera rotation
        camera.rotation.set(-currentTiltRadians, 0, 0)
    })

    return null
}

export default useStateCamera
