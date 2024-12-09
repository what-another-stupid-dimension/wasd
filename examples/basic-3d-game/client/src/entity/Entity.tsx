/* eslint-disable max-lines-per-function */
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import {
    Vector3, VideoTexture, LinearSRGBColorSpace, Group,
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
    const groupRef = useRef<Group>(null)
    const attributesRef = useRef<Group>(null)
    // eslint-disable-next-line no-undef
    const videoRef = useRef<HTMLVideoElement | null>(document.createElement('video'))
    const { clients, attachVideoStream, createOffer } = useWebRTC()
    const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null)

    const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([
        props.serverPosition[0],
        props.serverPosition[1],
        props.serverPosition[2],
    ])
    const currentPositionRef = useRef(new Vector3(...currentPosition))
    const targetPositionRef = useRef(new Vector3(...props.serverPosition))

    // Update the target position when the server position changes
    useEffect(() => {
        targetPositionRef.current.set(...props.serverPosition)
    }, [props.serverPosition])

    // Attach video stream and play
    useEffect(() => {
        const attachVideoStreamAndPlay = async () => {
            if (!videoRef.current) return

            try {
                let retries = 0
                const maxRetries = 20 // Timeout after 2 seconds (20 retries at 100ms interval)
                const interval = setInterval(() => {
                    const client = clients.find((peerClient) => peerClient.peerId === props.id)
                    if (client) {
                        clearInterval(interval)
                        attachVideoStream(videoRef.current!, props.id)

                      videoRef.current!.muted = props.id === 'your-local-client-id'
                      videoRef.current!.loop = false
                      videoRef.current!.play().catch((err) => {
                          console.warn('Video playback failed. User interaction required.', err)
                      })

                      const texture = new VideoTexture(videoRef.current!)
                      texture.colorSpace = LinearSRGBColorSpace
                      setVideoTexture(texture)
                    } else if (retries >= maxRetries) {
                        console.error(`Timeout: No remote stream for peerId: ${props.id}`)
                        clearInterval(interval)
                    }

                    retries += 1
                }, 100)
            } catch (err) {
                console.error(`Failed to attach video stream for peerId: ${props.id}`, err)
            }
        }

        attachVideoStreamAndPlay()

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null
                videoRef.current.pause()
            }
            setVideoTexture(null)
        }
    }, [clients, attachVideoStream, props.id])

    // Create an offer for this entity's WebRTC connection
    useEffect(() => {
        if (props.id) {
            createOffer(props.id).catch((err) => {
                console.error(`Failed to create offer for peerId: ${props.id}`, err)
            })
        }
    }, [createOffer, props.id])

    // Interpolate position for smooth movement
    useFrame((state, deltaTime) => {
        const { camera } = state
        const { current } = currentPositionRef
        const target = targetPositionRef.current
        const lerpFactor = Math.min(1, deltaTime * 8)

        current.lerp(target, lerpFactor)
        setCurrentPosition([current.x, current.y, current.z])
        currentPositionRef.current.copy(current)

        // Rotate the entity based on velocity
        const speed = props.velocity.length()
        if (speed > 0.1 && groupRef.current) {
            const direction = props.velocity.clone().normalize()
            const angle = Math.atan2(direction.x, direction.z)
            groupRef.current.rotation.y = angle
        }

        // Rotate the attributes (e.g., name and video) to face the camera
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
                        <meshStandardMaterial color="#1dd1bc" />
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
                                <meshBasicMaterial color="black" transparent opacity={0.2} />
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
                                        u_resolution: { value: [2, 2] },
                                    }}
                                    vertexShader={'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'}
                                    fragmentShader={'uniform sampler2D u_texture; varying vec2 vUv; void main() { vec2 centeredUV = vUv * 2.0 - 1.0; float dist = length(centeredUV); if (dist > 1.0) discard; gl_FragColor = texture2D(u_texture, vUv); }'}
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
