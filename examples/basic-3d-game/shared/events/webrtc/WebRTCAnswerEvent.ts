export default class WebRTCAnswerEvent {
    static name = 'webrtc:answer'

    constructor(
        public answer: RTCSessionDescriptionInit,
        public entityId: string, // Associated entity ID
    ) {}

    serialize() {
        return { answer: this.answer, entityId: this.entityId }
    }

    static deserialize(data: any) {
        if (!data || !data.answer || typeof data.answer !== 'object' || typeof data.entityId !== 'string') {
            throw new Error('Invalid data for WebRTCAnswerEvent')
        }
        return new WebRTCAnswerEvent(data.answer, data.entityId)
    }
}
