import { DomainEvent } from '../../domain/domain-event'
import { EventHandler } from './event-handler'
import { SimpleEvent } from './simple-event.js'

export interface EventBinding {
	handler: EventHandler
	event: typeof SimpleEvent | typeof DomainEvent<any>
}
