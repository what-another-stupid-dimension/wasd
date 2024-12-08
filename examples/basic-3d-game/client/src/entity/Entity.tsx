/* eslint-disable no-undef */
/* eslint-disable max-lines-per-function */
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import {
    Vector3, VideoTexture, TextureLoader, CircleGeometry, MeshStandardMaterial,
    LinearSRGBColorSpace,
} from 'three'
import { Text } from '@react-three/drei'
import { PlayerModel } from './player'
import { useWebRTC } from '../webRTC'

const Entity = (props: {
  id: string;
  serverPosition: [number, number, number];
  model?: string;
  velocity: Vector3;
  name?: string;
}) => {
    const groupRef = useRef<any>()
    const attributesRef = useRef<any>()
    const videoRef = useRef<HTMLVideoElement>(document.createElement('video'))
    const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null)

    const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([
        props.serverPosition[0],
        props.serverPosition[1],
        props.serverPosition[2],
    ])
    const currentPositionRef = useRef(new Vector3(...currentPosition))
    const targetPositionRef = useRef(new Vector3(...props.serverPosition))

    const { attachStream, isLocalStreamReady, createOffer } = useWebRTC()

    useEffect(() => {
        targetPositionRef.current.set(...props.serverPosition)
    }, [props.serverPosition])

    useEffect(() => {
        const attachVideoStream = async () => {
            if (!isLocalStreamReady || !videoRef.current) return
            await attachStream(videoRef.current, true)
            videoRef.current.muted = true
            videoRef.current.loop = true
            videoRef.current.play()
            const texture = new VideoTexture(videoRef.current)

            texture.colorSpace = LinearSRGBColorSpace

            setVideoTexture(texture)
        }

        attachVideoStream()
    }, [attachStream, isLocalStreamReady])

    useEffect(() => {
        createOffer(props.id)
    }, [createOffer, props.id])

    useFrame((state, deltaTime) => {
        const { camera } = state
        const { current } = currentPositionRef
        const target = targetPositionRef.current
        const lerpFactor = Math.min(1, deltaTime * 8)

        current.lerp(target, lerpFactor)
        setCurrentPosition([current.x, current.y, current.z])
        currentPositionRef.current.copy(current)

        const speed = props.velocity.length()
        if (speed > 0.1 && groupRef.current) {
            const direction = props.velocity.clone().normalize()
            const angle = Math.atan2(direction.x, direction.z)
            groupRef.current.rotation.y = angle
        }

        if (attributesRef.current) {
            attributesRef.current.quaternion.copy(camera.quaternion)
        }
    })

    return (
    <>
      <group ref={groupRef} position={currentPosition} scale={1} name={props.id}>
        {props.model === 'player' ? (
          <PlayerModel velocity={props.velocity} />
        ) : (
          <mesh>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color={'#1dd1bc'} />
          </mesh>
        )}
      </group>

      {props.name && (
        <group
          ref={attributesRef}
          position={[currentPosition[0], currentPosition[1] + 2, currentPosition[2]]}
        >
        {/* Circle mesh with video texture */}
        {videoTexture && (
          <>
            {/* Shadow */}
            <mesh position={[0, 1.5, -0.01]}>
              <circleGeometry args={[1.2, 64]} />
              <meshBasicMaterial
                color="black"
                transparent
                opacity={0.2}
              />
            </mesh>

            {/* White Border */}
            <mesh position={[0, 1.5, 0]}>
              <circleGeometry args={[1.1, 64]} />
              <meshBasicMaterial color="white" />
            </mesh>

            {/* Video */}
            <mesh position={[0, 1.5, 0.01]}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
              uniforms={{
                  u_texture: { value: videoTexture },
                  u_resolution: { value: [2, 2] }, // Plane size
              }}
              vertexShader={`
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                uniform sampler2D u_texture;
                varying vec2 vUv;

                void main() {
                  vec2 centeredUV = vUv * 2.0 - 1.0; // Normalize UV to range [-1, 1]
                  float dist = length(centeredUV);

                  // Crop to circle (alpha = 0 outside)
                  if (dist > 1.0) discard;

                  gl_FragColor = texture2D(u_texture, vUv);
                }
              `}
              transparent
            />
          </mesh>
          </>
        )}

          <Text
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
            outlineBlur={0.01}
            outlineOffsetX={0.005}
            outlineOffsetY={0.01}
            outlineOpacity={0.3}
            material-toneMapped={false}
            material-color="#a89c9c"
          >
            {props.name}
          </Text>
        </group>
      )}
    </>
    )
}

export default Entity
