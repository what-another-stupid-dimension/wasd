/* eslint-disable no-param-reassign */
/* eslint-disable max-lines-per-function */
import {
    useEffect, useRef, useCallback, useState,
} from 'react'
import { WebRTCEvents } from '@shared/events'
import { useNetwork } from '../network'

type UseWebRTCResult = {
  createOffer: (entityId: string) => Promise<void>;
  attachStream: (videoElement: HTMLVideoElement, local: boolean) => Promise<void>;
  isLocalStreamReady: boolean;
};

export default function useWebRTC(): UseWebRTCResult {
    const {
        bindNetworkEvent, unbindNetworkEvent, sendNetworkEvent, isConnected,
    } = useNetwork()

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const remoteStreamRef = useRef<MediaStream | null>(null)
    const [isLocalStreamReady, setIsLocalStreamReady] = useState(false)

    const setupPeerConnection = useCallback(
        (entityId: string) => {
            if (peerConnectionRef.current) return

            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            })

            const remoteStream = new MediaStream()
            remoteStreamRef.current = remoteStream

            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track)
                })
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log(`Sending ICE candidate for entity ${entityId}`)
                    sendNetworkEvent(new WebRTCEvents.WebRTCIceCandidateEvent(
                        event.candidate,
                        entityId,
                    ))
                }
            }

            peerConnectionRef.current = peerConnection
        },
        [sendNetworkEvent],
    )

    const initializeLocalMedia = useCallback(async () => {
        if (localStreamRef.current) return

        try {
            const localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            })
            localStreamRef.current = localStream
            setIsLocalStreamReady(true)

            localStream.getTracks().forEach((track) => {
                peerConnectionRef.current?.addTrack(track, localStream)
            })
        } catch (error) {
            console.error('Failed to initialize local media:', error)
        }
    }, [])

    const createOffer = useCallback(
        async (entityId: string) => {
            if (!peerConnectionRef.current || peerConnectionRef.current.signalingState !== 'stable') {
                console.warn('Skipping offer creation: PeerConnection is not stable.')
                return
            }

            const offer = await peerConnectionRef.current.createOffer()
            await peerConnectionRef.current.setLocalDescription(offer)

            if (offer.sdp) {
                sendNetworkEvent(new WebRTCEvents.WebRTCOfferEvent(offer.sdp, 'offer', entityId))
            } else {
                console.error('Failed to create offer: SDP is undefined')
            }
        },
        [sendNetworkEvent],
    )

    const attachStream = useCallback(async (videoElement: HTMLVideoElement, local: boolean) => {
        const stream = local ? localStreamRef.current : remoteStreamRef.current
        if (!stream) {
            console.warn(`No ${local ? 'local' : 'remote'} stream available.`)
            return
        }
        videoElement.srcObject = stream
    }, [])

    useEffect(() => {
        if (!isConnected) return () => {}

        const entityId = 'your-entity-id' // Replace with dynamic assignment from your context

        setupPeerConnection(entityId)
        initializeLocalMedia()

        const handleOffer = async (event: WebRTCEvents.WebRTCOfferEvent) => {
            const { sdp, type, entityId } = event
            console.log(`Received WebRTC offer for entity ${entityId}`)

            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription({
                sdp,
                type,
            }))

            if (!localStreamRef.current) {
                await initializeLocalMedia()
            }

            const answer = await peerConnectionRef.current?.createAnswer()
            await peerConnectionRef.current?.setLocalDescription(answer)

            if (answer) {
                sendNetworkEvent(new WebRTCEvents.WebRTCAnswerEvent(answer, entityId))
            }
        }

        const handleAnswer = async (event: WebRTCEvents.WebRTCAnswerEvent) => {
            const { answer, entityId } = event
            console.log(`Received WebRTC answer for entity ${entityId}`)
            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer))
        }

        const handleIceCandidate = async (event: WebRTCEvents.WebRTCIceCandidateEvent) => {
            const { candidate, entityId } = event
            console.log(`Received ICE candidate for entity ${entityId}`)
            await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
        }

        bindNetworkEvent(WebRTCEvents.WebRTCOfferEvent.name, handleOffer)
        bindNetworkEvent(WebRTCEvents.WebRTCAnswerEvent.name, handleAnswer)
        bindNetworkEvent(WebRTCEvents.WebRTCIceCandidateEvent.name, handleIceCandidate)

        return () => {
            unbindNetworkEvent(WebRTCEvents.WebRTCOfferEvent.name, handleOffer)
            unbindNetworkEvent(WebRTCEvents.WebRTCAnswerEvent.name, handleAnswer)
            unbindNetworkEvent(WebRTCEvents.WebRTCIceCandidateEvent.name, handleIceCandidate)
        }
    }, [
        isConnected,
        setupPeerConnection,
        initializeLocalMedia,
        sendNetworkEvent,
        bindNetworkEvent,
        unbindNetworkEvent,
    ])

    return {
        createOffer,
        attachStream,
        isLocalStreamReady,
    }
}
