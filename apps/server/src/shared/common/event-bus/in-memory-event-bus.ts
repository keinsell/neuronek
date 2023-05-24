import { EventHandler } from '../../core/cqrs/event/event-handler.js'
import { IntegrationEvent } from '../../core/cqrs/event/integration-event.js'
import { UniqueId } from '../../core/indexing/unique-id.js'
import { EventBus } from './event-bus.js'
import { EventEmitter } from 'events'
import type { Constructor } from 'type-fest'

export class InMemoryEventBus extends EventBus {
	private bindingStorage: Map<Constructor<IntegrationEvent>, EventHandler>
	private eventEmitter: EventEmitter
	private listeners: Set<UniqueId>

	constructor() {
		super()
		this.bindingStorage = new Map<Constructor<IntegrationEvent>, EventHandler>()
		this.eventEmitter = new EventEmitter()
		this.listeners = new Set()
	}

	public async dispatch(event: IntegrationEvent): Promise<void> {
		const handler = this.bindingStorage.get(event.constructor as Constructor<IntegrationEvent>)

		if (handler) {
			this.eventEmitter.emit(event.constructor.name, event)
			console.log(`${this.constructor.name} published ${event.constructor.name}`)
		} else {
			throw new Error(`No handler registered for command type: ${event.constructor.name}`)
		}
	}

	public registerHandler<T extends IntegrationEvent = IntegrationEvent>(
		event: Constructor<T>,
		handler: EventHandler
	): void {
		this.bindingStorage.set(event, handler)
		this.eventEmitter.on(event.name, async (command: T) => {
			await this.handleSingleEvent(command)
			this.listeners.delete(command._id)
		})
	}

	async handle(event: IntegrationEvent): Promise<void> {
		this.listeners.add(event._id)
		await this.dispatch(event)

		while (this.listeners.has(event._id)) {
			await new Promise(resolve => setTimeout(resolve, 10))
		}
	}

	private async handleSingleEvent(event: IntegrationEvent): Promise<void> {
		const handler = this.bindingStorage.get(event.constructor as Constructor<IntegrationEvent>)

		if (handler) {
			await handler.handle(event)
		} else {
			throw new Error(`No handler registered for command type: ${event.constructor.name}`)
		}
	}
}
