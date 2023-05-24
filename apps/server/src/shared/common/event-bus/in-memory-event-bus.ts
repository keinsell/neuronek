import { EventHandler } from '../../core/cqrs/event/event-handler.js'
import { IntegrationEvent } from '../../core/cqrs/event/integration-event.js'
import { EventBus } from './event-bus.js'
import { EventEmitter } from 'events'
import type { Constructor } from 'type-fest'

export class InMemoryEventBus extends EventBus {
	private bindingStorage: Map<Constructor<IntegrationEvent>, EventHandler>
	private eventEmitter: EventEmitter

	constructor() {
		super()
		this.bindingStorage = new Map<Constructor<IntegrationEvent>, EventHandler>()
		this.eventEmitter = new EventEmitter()
	}

	public async handle(command: IntegrationEvent): Promise<void> {
		const handler = this.bindingStorage.get(command.constructor as Constructor<IntegrationEvent>)

		if (handler) {
			return await handler.handle(command)
		} else {
			throw new Error(`No handler registered for command type: ${command.constructor.name}`)
		}
	}

	public registerHandler<T extends IntegrationEvent = IntegrationEvent>(
		commandConstructor: Constructor<T>,
		handler: EventHandler
	): void {
		this.bindingStorage.set(commandConstructor, handler)
		this.eventEmitter.on(commandConstructor.name, async (command: T) => {
			await this.handle(command)
		})
	}

	public async dispatch(command: IntegrationEvent): Promise<void> {
		const handler = this.bindingStorage.get(command.constructor as Constructor<IntegrationEvent>)

		if (handler) {
			this.eventEmitter.emit(command.constructor.name, command)
		} else {
			throw new Error(`No handler registered for command type: ${command.constructor.name}`)
		}
	}
}
