export default class WebRTCIceCandidateEvent {
    static name = 'webrtc:iceCandidate'

    constructor(
        public candidate: RTCIceCandidateInit,
        public entityId: string, // Associated entity ID
    ) {}

    serialize() {
        return { candidate: this.candidate, entityId: this.entityId }
    }

    static deserialize(data: any) {
        if (!data || typeof data.candidate !== 'object' || typeof data.entityId !== 'string') {
            throw new Error('Invalid data for WebRTCIceCandidateEvent')
        }
        return new WebRTCIceCandidateEvent(data.candidate as RTCIceCandidateInit, data.entityId)
    }
}
