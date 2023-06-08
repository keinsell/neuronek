import { EventEmitter }                        from 'events'
import { EventBus, EventHandler, SystemEvent } from '~foundry/cqrs'
import { MessageConstructor }                  from '~foundry/technical/class-constructor.js'



export class InMemoryEventBus
	implements EventBus {
	private bindingStorage : Map<string, EventHandler<any>>
	private eventEmitter : EventEmitter
	
	constructor() {
		this.bindingStorage = new Map<string, EventHandler<any>>()
		this.eventEmitter = new EventEmitter()
	}
	
	public async dispatch(event : SystemEvent) : Promise<void> {
		this.eventEmitter.emit( event._type, event )
	}
	
	public async handle(event : SystemEvent) : Promise<void> {
		const handler = this.bindingStorage.get( event._type )
		
		if(handler) {
			await handler.handle( event )
		}
	}
	
	public async subscribe<T extends SystemEvent>(event : MessageConstructor<T>,
		handler : EventHandler<T>,
	) : Promise<void> {
		this.bindingStorage.set( event.type, handler )
		this.eventEmitter.on( event.type, handler.handle )
	}
	
	public async unsubscribe<T extends SystemEvent>(event : MessageConstructor<T>,
		handler : EventHandler<T>,
	) : Promise<void> {
		this.bindingStorage.delete( event.type )
		this.eventEmitter.off( event.type, handler.handle )
	}
}
