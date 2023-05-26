import { Entity } from './enity.js'
import { IntegrationEvent } from '~foundry/cqrs'

export abstract class DomainEvent<T extends Entity> extends IntegrationEvent {
	protected constructor(name: string, public aggregate: T) {
		super(name)
	}
}
