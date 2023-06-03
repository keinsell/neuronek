import { Aggregate }   from './aggregate.js'
import { DomainEvent } from './domain-event.js'



export abstract class DomainHandler<T extends DomainEvent<Aggregate>> {
	abstract handle(event: T): Promise<void>
}
