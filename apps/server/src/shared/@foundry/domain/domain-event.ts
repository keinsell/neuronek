import { SimpleEvent } from '~foundry/cqrs'
import { Entity }      from './enity.js'



export abstract class DomainEvent<T extends Entity> extends SimpleEvent {
	protected constructor(public aggregate: T) {
		super()
	}
}
