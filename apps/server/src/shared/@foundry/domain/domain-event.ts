import { SystemEvent } from '~foundry/cqrs'
import { Entity }      from './enity.js'



export abstract class DomainEvent<T extends Entity = Entity>
	extends SystemEvent<T> {
	
}
