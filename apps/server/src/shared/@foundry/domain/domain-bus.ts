import { Aggregate }     from './aggregate.js'
import { DomainEvent }   from './domain-event.js'
import { DomainHandler } from './domain-handler.js'
import { Entity }        from './enity.js'



export abstract class DomainBus<T extends Aggregate | Entity> {
	/**
	 * Dispatch event to all subscribed handlers, this method uses "fire-and-forget" methods which makes the whole
	 *  process asynchronous.
	 */
	abstract dispatch(event: DomainEvent<T>): Promise<void> | void

	abstract handle(event: DomainEvent<T>): Promise<void> | void

	abstract subscribe<X extends DomainEvent<T>>(
		eventClass: new (...args: any[]) => X,
		handler: DomainHandler<DomainEvent<T>>
	): Promise<void> | void

	abstract unsubscribe<X extends DomainEvent<T>>(
		eventClass: new (...args: any[]) => X,
		handler: DomainHandler<DomainEvent<T>>
	): Promise<void> | void
}
