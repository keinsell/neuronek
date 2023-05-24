import { CommandHandler } from '../../core/cqrs/command/command-handler.js'
import { Command } from '../../core/cqrs/command/command.js'
import { CommandBus } from './command-bus.js'
import { EventEmitter } from 'events'
import type { Constructor } from 'type-fest'

export class InMemoryCommandBus extends CommandBus {
	private bindingStorage: Map<Constructor<Command>, CommandHandler>
	private eventEmitter: EventEmitter

	constructor() {
		super()
		this.bindingStorage = new Map<Constructor<Command>, CommandHandler>()
		this.eventEmitter = new EventEmitter()
	}

	public async handle(command: Command): Promise<void> {
		const handler = this.bindingStorage.get(command.constructor as Constructor<Command>)

		if (handler) {
			return await handler.handle(command)
		} else {
			throw new Error(`No handler registered for command type: ${command.constructor.name}`)
		}
	}

	public registerHandler<T extends Command = Command>(
		commandConstructor: Constructor<T>,
		handler: CommandHandler<T>
	): void {
		this.bindingStorage.set(commandConstructor, handler)
		this.eventEmitter.on(commandConstructor.name, async (command: T) => {
			await this.handle(command)
		})
	}

	public async dispatch(command: Command): Promise<void> {
		const handler = this.bindingStorage.get(command.constructor as Constructor<Command>)

		if (handler) {
			this.eventEmitter.emit(command.constructor.name, command)
		} else {
			throw new Error(`No handler registered for command type: ${command.constructor.name}`)
		}
	}
}
