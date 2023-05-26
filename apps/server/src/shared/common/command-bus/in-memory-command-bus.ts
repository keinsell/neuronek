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
		const handler = this.bindingStorage.get(command._type)

		if (handler) {
			return await handler.handle(command)
		} else {
			throw new Error(`No handler registered for command type: ${command._type}`)
		}
	}

	public async dispatch(command: Command): Promise<void> {
		this.eventEmitter.emit(command._type, command)
	}

	async subscribe(command: Command, handler: CommandHandler<Command>): Promise<void> {
		this.bindingStorage.set(command._type, handler)
		this.eventEmitter.on(command._type, async (command: Command) => {
			await this.handle(command)
		})
	}

	async unsubscribe(command: Command, _handler: CommandHandler<Command>): Promise<void> {
		this.bindingStorage.delete(command._type)
		this.eventEmitter.removeAllListeners(command._type)
	}
}
