import { DomainEvent } from '../../domain/domain-event'
import { Event } from './event'
import { EventHandler } from './event-handler'

export interface EventBinding {
	handler: EventHandler<any>
	event: typeof Event<any> | typeof DomainEvent<any>
}
