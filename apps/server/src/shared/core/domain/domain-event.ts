import { IntegrationEvent } from '../cqrs/event/integration-event.js'
import { Entity } from './enity.js'

export abstract class DomainEvent<T extends Entity> extends IntegrationEvent {
	protected constructor(name: string, public aggregate: T) {
		super(name)
	}
}
