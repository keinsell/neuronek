import { EventEmitter }               from 'events'
import { DomainEvent, DomainHandler } from '~foundry/domain'
import { ClassConstructor }           from '~foundry/technical/class-constructor.js'
import { DomainBus }                  from '../../@foundry/domain/domain-bus.js'



export class InMemoryDomainBus<T extends DomainEvent>
	implements DomainBus<T> {
	private bindingStorage : Map<string, DomainHandler<T>>
	private eventEmitter : EventEmitter
	
	constructor() {
		this.bindingStorage = new Map<string, DomainHandler<T>>()
		this.eventEmitter = new EventEmitter()
	}
	
	public async dispatch(event : T) : Promise<void> {
		const eventType = event.constructor.name
		this.eventEmitter.emit( eventType, event )
	}
	
	public async handle(event : T) : Promise<void> {
		const eventType = event.constructor.name
		const handler = this.bindingStorage.get( eventType )
		
		if(handler) {
			await handler.handle( event )
		}
	}
	
	public subscribe<X extends T>(event : ClassConstructor<X>, handler : DomainHandler<X>) : void {
		const eventType = event.constructor.name
		this.bindingStorage.set( eventType, handler )
		this.eventEmitter.on( eventType, handler.handle )
	}
	
	public unsubscribe<X extends T>(eventClass : { new(...args : any[]) : X }, handler : DomainHandler<T>) : void {
		const eventType = eventClass.name
		this.bindingStorage.delete( eventType )
		this.eventEmitter.off( eventType, handler.handle )
	}
}
