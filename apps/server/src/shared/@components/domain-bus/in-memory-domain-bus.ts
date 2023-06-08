import { EventEmitter }               from 'events'
import { DomainEvent, DomainHandler } from '~foundry/domain'
import { ClassConstructor }           from '~foundry/technical/class-constructor.js'
import { DomainBus }                  from '../../@foundry/domain/domain-bus.js'



export class InMemoryDomainBus<Events extends DomainEvent>
	implements DomainBus<Events> {
	private bindingStorage : Map<string, DomainHandler<Events>>
	private eventEmitter : EventEmitter
	
	constructor() {
		this.bindingStorage = new Map<string, DomainHandler<Events>>()
		this.eventEmitter = new EventEmitter()
		
	}
	
	public async dispatch<T extends Events>(event : T) : Promise<void> {
		const eventType = event.constructor.name
		this.eventEmitter.emit( eventType, event )
	}
	
	public async handle<T extends Events>(event : T) : Promise<void> {
		const eventType = event.constructor.name
		const handler = this.bindingStorage.get( eventType )
		
		if(handler) {
			await handler.handle( event )
		}
	}
	
	public subscribe<T extends Events>(event : ClassConstructor<T>, handler : DomainHandler<T>) : void {
		console.log( event )
		const eventType = event.constructor.name
		this.bindingStorage.set( eventType, handler )
		this.eventEmitter.on( eventType, handler.handle )
	}
	
	public unsubscribe<T extends Events>(event : ClassConstructor<T>, handler : DomainHandler<T>) : void {
		const eventType = event.constructor.name
		this.bindingStorage.delete( eventType )
		this.eventEmitter.off( eventType, handler.handle )
	}
}
