import { DomainEvent } from '../../domain/domain-event'
import { EventHandler } from './event-handler'
import { SimpleEvent } from './simple-event'

export interface EventBinding {
	handler: EventHandler<any>
	event: typeof SimpleEvent<any> | typeof DomainEvent<any>
}
