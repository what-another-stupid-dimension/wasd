export default class WebRTCOfferEvent {
    static name = 'webrtc:offer'

    constructor(
        public sdp: string,
        public type: 'offer' | 'answer',
        public entityId: string, // Associated entity ID
    ) {}

    serialize() {
        return { sdp: this.sdp, type: this.type, entityId: this.entityId }
    }

    static deserialize(data: any) {
        if (!data || typeof data.sdp !== 'string' || typeof data.type !== 'string' || typeof data.entityId !== 'string') {
            throw new Error('Invalid data for WebRTCOfferEvent')
        }
        return new WebRTCOfferEvent(data.sdp, data.type as 'offer' | 'answer', data.entityId)
    }
}
