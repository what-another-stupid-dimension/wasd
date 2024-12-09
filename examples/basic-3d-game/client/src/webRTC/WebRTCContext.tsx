/* eslint-disable max-lines-per-function */
import React, {
    createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode,
} from 'react'
import { WebRTCEvents } from '@shared/events'
import { useNetwork } from '../network'

type WebRTCConnection = {
    peerConnection: RTCPeerConnection;
    remoteStream: MediaStream;
    isPolite: boolean;
    makingOffer: boolean;
    isSettingRemoteDescription: boolean;
};

type WebRTCClientData = {
    peerId: string;
    remoteStream: MediaStream;
};

type WebRTCContextType = {
    clients: WebRTCClientData[];
    attachVideoStream: (videoElement: HTMLVideoElement, peerId: string) => void;
    createOffer: (peerId: string) => Promise<void>;
    initializeLocalStream: () => Promise<void>;
    toggleMute: () => void;
    toggleVideo: () => void;
    shareScreen: () => Promise<void>;
    stopScreenShare: () => void;
    localStream: MediaStream | null;
    isScreenSharing: boolean;
};

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined)

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { bindNetworkEvent, unbindNetworkEvent, sendNetworkEvent } = useNetwork()
    const localStreamRef = useRef<MediaStream | null>(null)
    const connections = useRef<Map<string, WebRTCConnection>>(new Map())
    const [clients, setClients] = useState<WebRTCClientData[]>([])
    const [isScreenSharing, setIsScreenSharing] = useState(false)

    const initializeLocalStream = useCallback(async () => {
        if (!localStreamRef.current) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                })
                localStreamRef.current = stream
            } catch (error) {
                console.error('Failed to initialize local stream:', error)
            }
        }
    }, [])

    const toggleMute = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                // eslint-disable-next-line no-param-reassign
                track.enabled = !track.enabled
            })
        }
    }, [])

    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => {
                // eslint-disable-next-line no-param-reassign
                track.enabled = !track.enabled
            })
        }
    }, [])

    const stopScreenShare = useCallback(() => {
        if (isScreenSharing && localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => track.stop())

            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                const videoTrack = stream.getVideoTracks()[0]
                localStreamRef.current?.addTrack(videoTrack)
            })

            setIsScreenSharing(false)
        }
    }, [isScreenSharing])

    const shareScreen = useCallback(async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                })

                const screenTrack = screenStream.getVideoTracks()[0]
                const localStream = localStreamRef.current

                if (localStream) {
                    localStream.getVideoTracks().forEach((track) => track.stop())
                    localStream.addTrack(screenTrack)
                }

                screenTrack.onended = () => stopScreenShare()

                setIsScreenSharing(true)
            } catch (error) {
                console.error('Failed to share screen:', error)
            }
        }
    }, [isScreenSharing, stopScreenShare])

    const ensureConnection = useCallback((peerId: string): WebRTCConnection => {
        if (!connections.current.has(peerId)) {
            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            })

            const remoteStream = new MediaStream()

            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track))

                setClients((prevClients) => {
                    const existingClient = prevClients.find((client) => client.peerId === peerId)

                    if (!existingClient) {
                        return [...prevClients, { peerId, remoteStream }]
                    }

                    return prevClients
                })
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    sendNetworkEvent(
                        new WebRTCEvents.WebRTCIceCandidateEvent(event.candidate, peerId),
                    )
                }
            }

            peerConnection.onsignalingstatechange = () => {
                console.log(`Signaling state changed for peer ${peerId}:`, peerConnection.signalingState)
            }

            connections.current.set(peerId, {
                peerConnection,
                remoteStream,
                isPolite: false,
                makingOffer: false,
                isSettingRemoteDescription: false,
            })
        }

        return connections.current.get(peerId)!
    }, [sendNetworkEvent])

    const attachVideoStream = useCallback((videoElement: HTMLVideoElement, peerId: string) => {
        const client = clients.find((c) => c.peerId === peerId)
        if (client) {
            // eslint-disable-next-line no-param-reassign
            videoElement.srcObject = client.remoteStream
        } else {
            console.warn(`No remote stream for peerId: ${peerId}`)
        }
    }, [clients])

    const createOffer = useCallback(async (peerId: string) => {
        const connection = ensureConnection(peerId)

        if (connection.peerConnection.signalingState === 'stable' && !connection.makingOffer) {
            connection.makingOffer = true

            try {
                localStreamRef.current?.getTracks().forEach((track) => {
                    if (
                        !connection.peerConnection.getSenders()
                            .find((sender) => sender.track === track)
                    ) {
                        connection.peerConnection.addTrack(track, localStreamRef.current!)
                    }
                })

                const offer = await connection.peerConnection.createOffer()
                await connection.peerConnection.setLocalDescription(offer)

                sendNetworkEvent(new WebRTCEvents.WebRTCOfferEvent(offer.sdp!, 'offer', peerId))
            } catch (error) {
                console.error('Error creating offer:', error)
            } finally {
                connection.makingOffer = false
            }
        }
    }, [ensureConnection, sendNetworkEvent])

    useEffect(() => {
        const handleOffer = async (event: WebRTCEvents.WebRTCOfferEvent) => {
            const { sdp, senderId } = event
            const connection = ensureConnection(senderId)

            if (connection.isSettingRemoteDescription) {
                console.warn('Already setting remote description. Skipping offer.')
                return
            }

            connection.isSettingRemoteDescription = true

            try {
                await connection.peerConnection.setRemoteDescription(
                    new RTCSessionDescription({ sdp, type: 'offer' }),
                )

                const answer = await connection.peerConnection.createAnswer()
                await connection.peerConnection.setLocalDescription(answer)

                sendNetworkEvent(new WebRTCEvents.WebRTCAnswerEvent(answer.sdp!, 'answer', senderId))
            } catch (error) {
                console.error('Error handling offer:', error)
            } finally {
                connection.isSettingRemoteDescription = false
            }
        }

        const handleAnswer = async (event: WebRTCEvents.WebRTCAnswerEvent) => {
            const { sdp, senderId } = event
            const connection = connections.current.get(senderId)

            if (connection) {
                try {
                    await connection.peerConnection.setRemoteDescription(
                        new RTCSessionDescription({ sdp, type: 'answer' }),
                    )
                } catch (error) {
                    console.error('Error handling answer:', error)
                }
            }
        }

        const handleIceCandidate = async (event: WebRTCEvents.WebRTCIceCandidateEvent) => {
            const { candidate, senderId } = event
            const connection = connections.current.get(senderId)

            if (connection) {
                try {
                    await connection.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                } catch (error) {
                    console.error('Error adding ICE candidate:', error)
                }
            }
        }

        bindNetworkEvent(WebRTCEvents.WebRTCOfferEvent.name, handleOffer)
        bindNetworkEvent(WebRTCEvents.WebRTCAnswerEvent.name, handleAnswer)
        bindNetworkEvent(WebRTCEvents.WebRTCIceCandidateEvent.name, handleIceCandidate)

        return () => {
            unbindNetworkEvent(WebRTCEvents.WebRTCOfferEvent.name, handleOffer)
            unbindNetworkEvent(WebRTCEvents.WebRTCAnswerEvent.name, handleAnswer)
            unbindNetworkEvent(WebRTCEvents.WebRTCIceCandidateEvent.name, handleIceCandidate)
        }
    }, [bindNetworkEvent, unbindNetworkEvent, ensureConnection, sendNetworkEvent])

    return (
        <WebRTCContext.Provider
            value={{
                clients,
                attachVideoStream,
                createOffer,
                initializeLocalStream,
                toggleMute,
                toggleVideo,
                shareScreen,
                stopScreenShare,
                localStream: localStreamRef.current,
                isScreenSharing,
            }}
        >
            {children}
        </WebRTCContext.Provider>
    )
}

export const useWebRTC = (): WebRTCContextType => {
    const context = useContext(WebRTCContext)
    if (!context) {
        throw new Error('useWebRTC must be used within a WebRTCProvider')
    }
    return context
}
