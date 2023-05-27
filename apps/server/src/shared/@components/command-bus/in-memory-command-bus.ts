import { EventEmitter } from 'events'
import { Command, CommandBus, CommandHandler } from '~foundry/cqrs'

export class InMemoryCommandBus extends CommandBus {
	private bindingStorage: Map<string, CommandHandler>
	private eventEmitter: EventEmitter

	constructor() {
		super()
		this.bindingStorage = new Map<string, CommandHandler>()
		this.eventEmitter = new EventEmitter()
	}

	public async handle(command: Command): Promise<void> {
		const commandType = command.constructor.name
		const handler = this.bindingStorage.get(commandType)
		if (handler) {
			await handler.handle(command)
		} else {
			throw new Error(`No handler registered for command: ${commandType}`)
		}
	}

	public async dispatch(command: Command): Promise<void> {
		const commandType = command.constructor.name
		this.eventEmitter.emit(commandType, command)
	}

	public async subscribe<T extends Command>(
		commandClass: new (...args: any[]) => T,
		handler: CommandHandler
	): Promise<void> {
		const commandType = commandClass.name
		this.bindingStorage.set(commandType, handler)
		this.eventEmitter.on(commandType, handler.handle)
	}

	public async unsubscribe<T extends Command>(
		commandClass: new (...args: any[]) => T,
		handler: CommandHandler
	): Promise<void> {
		const commandType = commandClass.name
		this.bindingStorage.delete(commandType)
		this.eventEmitter.off(commandType, handler.handle)
	}
}
