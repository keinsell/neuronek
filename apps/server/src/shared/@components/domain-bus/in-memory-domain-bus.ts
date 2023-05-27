import { DomainBus } from '../../@foundry/domain/domain-bus.js'
import { EventEmitter } from 'events'
import { Aggregate, DomainEvent, DomainHandler, Entity } from '~foundry/domain'

export class InMemoryDomainBus<T extends Aggregate | Entity> implements DomainBus<T> {
	private bindingStorage: Map<string, DomainHandler<DomainEvent<T>>>
	private eventEmitter: EventEmitter

	constructor() {
		this.bindingStorage = new Map<string, DomainHandler<DomainEvent<T>>>()
		this.eventEmitter = new EventEmitter()
	}

	public async dispatch(event: DomainEvent<T>): Promise<void> {
		const eventType = event.constructor.name
		this.eventEmitter.emit(eventType, event)
	}

	public async handle(event: DomainEvent<T>): Promise<void> {
		const eventType = event.constructor.name
		const handler = this.bindingStorage.get(eventType)

		if (handler) {
			await handler.handle(event)
		}
	}

	public subscribe<X extends DomainEvent<T>>(
		eventClass: { new (...args: any[]): X },
		handler: DomainHandler<DomainEvent<T>>
	): void {
		const eventType = eventClass.name
		this.bindingStorage.set(eventType, handler)
		this.eventEmitter.on(eventType, handler.handle)
	}

	public unsubscribe<X extends DomainEvent<T>>(
		eventClass: { new (...args: any[]): X },
		handler: DomainHandler<DomainEvent<T>>
	): void {
		const eventType = eventClass.name
		this.bindingStorage.delete(eventType)
		this.eventEmitter.off(eventType, handler.handle)
	}
}
