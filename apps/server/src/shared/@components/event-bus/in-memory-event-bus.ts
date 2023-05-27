import { EventEmitter } from 'events'
import { EventBus, EventHandler, SimpleEvent } from '~foundry/cqrs'

export class InMemoryEventBus extends EventBus {
	private bindingStorage: Map<string, EventHandler>
	private eventEmitter: EventEmitter

	constructor() {
		super()
		this.bindingStorage = new Map<string, EventHandler>()
		this.eventEmitter = new EventEmitter()
	}

	public async dispatch(event: SimpleEvent): Promise<void> {
		const eventType = event._type
		this.eventEmitter.emit(eventType, event)
	}

	public async handle(event: SimpleEvent): Promise<void> {
		const eventType = event._type
		const handler = this.bindingStorage.get(eventType)

		if (handler) {
			await handler.handle(event)
		}
	}

	public async subscribe<T extends SimpleEvent>(
		eventClass: { new (...args: any[]): T },
		handler: EventHandler
	): Promise<void> {
		const eventType = (eventClass as any as typeof SimpleEvent).type
		this.bindingStorage.set(eventType, handler)
		this.eventEmitter.on(eventType, handler.handle)
	}

	public async unsubscribe<T extends SimpleEvent>(
		eventClass: { new (...args: any[]): T },
		handler: EventHandler
	): Promise<void> {
		const eventType = (eventClass as any as typeof SimpleEvent).type
		this.bindingStorage.delete(eventType)
		this.eventEmitter.off(eventType, handler.handle)
	}
}
