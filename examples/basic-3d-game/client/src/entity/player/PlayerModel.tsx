import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Vector3 } from 'three'

function PlayerModel({
    velocity,
}: {
  velocity: Vector3
}) {
    const groupRef = useRef<any>()
    // const { scene, animations } = useGLTF('/models/player.glb')
    // const { actions } = useAnimations(animations, groupRef)
    const [currentAction, setCurrentAction] = useState('Idle')

    useFrame(() => {
        const speed = velocity.length()
        const newAction = speed > 0.1 ? 'Walk' : 'Idle'

        if (currentAction !== newAction) {
            // actions[currentAction]?.fadeOut(0.2)
            // actions[newAction]?.reset().fadeIn(0.2).play()
            setCurrentAction(newAction)
        }
    })

    return (
    <group ref={groupRef}>
      {/* <primitive object={scene} /> */}
      {/* Remove this after verifying text placement */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
    )
}

export default PlayerModel
