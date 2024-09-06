import { EventBus } from './types'

export default class EventModuleProperties {
    constructor(
        public readonly eventBus?: EventBus,
    ) {
    }
}
