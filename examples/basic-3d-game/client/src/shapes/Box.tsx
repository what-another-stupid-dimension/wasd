import { ThreeElements, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

const Box = (props: ThreeElements['mesh']) => {
    const meshRef = useRef<Mesh>(null!)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => {
        const radius = 0.25
        const speed = 0.5

        meshRef.current.rotation.y += delta * speed
        meshRef.current.rotation.x += delta * speed
        meshRef.current.rotation.z += delta * speed

        meshRef.current.position.x = Math.cos(state.clock.elapsedTime * speed * 2)
        * radius
        * (props.position as number[])[0]
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * speed)
        * radius
        * (props.position as number[])[1]
    })
    return (
      <mesh
        {...props}
        ref={meshRef}
        scale={1}
        onClick={() => setActive(!active)}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={'#1dd1bc'} />
      </mesh>
    )
}

export default Box
