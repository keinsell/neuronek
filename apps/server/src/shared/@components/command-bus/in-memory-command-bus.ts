import { EventEmitter }                        from 'events'
import { Command, CommandBus, CommandHandler } from '~foundry/cqrs'
import { ClassConstructor }                    from '~foundry/technical/class-constructor.js'



export class InMemoryCommandBus<COMMANDS extends Command<unknown>>
	implements CommandBus<COMMANDS> {
	private bindingStorage : Map<string, CommandHandler<COMMANDS>>
	private eventEmitter : EventEmitter
	
	constructor() {
		this.bindingStorage = new Map<string, CommandHandler<COMMANDS>>()
		this.eventEmitter = new EventEmitter()
	}
	
	public async handle<T extends COMMANDS>(command : T) : Promise<T['_response']> {
		const commandType = command.constructor.name
		const handler = this.bindingStorage.get( commandType )
		if(handler) {
			return await handler.handle( command )
		}
		else {
			throw new Error( `No handler registered for command: ${ commandType }` )
		}
	}
	
	public async dispatch(command : COMMANDS) : Promise<void> {
		const commandType = command.constructor.name
		this.eventEmitter.emit( commandType, command )
	}
	
	public async subscribe<T extends COMMANDS>(command : ClassConstructor<T>,
		handler : CommandHandler<T>,
	) : Promise<void> {
		const commandType = command.name
		this.bindingStorage.set( commandType, handler )
		this.eventEmitter.on( commandType, (t : any) => handler.handle( t ) )
	}
	
	public async unsubscribe<T extends COMMANDS>(command : ClassConstructor<T>,
		handler : CommandHandler<T>,
	) : Promise<void> {
		const commandType = command.name
		this.bindingStorage.delete( commandType )
		this.eventEmitter.off( commandType, handler.handle )
	}
}
