import { DomainEvent } from '../../domain/domain-event'
import { EventHandler } from './event-handler'
import { IntegrationEvent } from './integration-event.js'

export interface EventBinding {
	handler: EventHandler
	event: typeof IntegrationEvent | typeof DomainEvent<any>
}
