import { ThreeElements, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh, Vector3 } from 'three'

const Entity = (props: ThreeElements['mesh'] & { serverPosition: [number, number, number] }) => {
    const meshRef = useRef<Mesh>(null!)
    const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 0])
    const targetPositionRef = useRef(new Vector3(...props.serverPosition))
    const currentPositionRef = useRef(new Vector3(...currentPosition))

    // Update the target position whenever the server sends a new one
    targetPositionRef.current.set(...props.serverPosition)

    useFrame((_, deltaTime) => {
        // Get the current and target positions as Vector3
        const { current } = currentPositionRef
        const target = targetPositionRef.current

        // Lerp between the current position and the target
        const lerpFactor = Math.min(1, deltaTime * 10) // Adjust speed of interpolation
        current.lerp(target, lerpFactor)

        // Update position state and reference for rendering
        setCurrentPosition([current.x, current.y, current.z])
        currentPositionRef.current.copy(current)
    })

    return (
        <mesh
            {...props}
            ref={meshRef}
            position={currentPosition}
            scale={1}
        >
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={'#1dd1bc'} />
        </mesh>
    )
}

export default Entity
