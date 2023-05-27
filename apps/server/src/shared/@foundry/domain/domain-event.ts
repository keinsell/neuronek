import { Entity } from './enity.js'
import { SimpleEvent } from '~foundry/cqrs'

export abstract class DomainEvent<T extends Entity> extends SimpleEvent {
	protected constructor(public aggregate: T) {
		super()
	}
}
