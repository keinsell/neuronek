import { MessageConstructor } from '../../technical/class-constructor.js'
import { EventHandler }       from './event-handler.js'
import { SystemEvent }        from './system.event.js'



/**
 * Event bus is to enable loosely coupled communication between components or modules in a software system. It
 * allows components to publish and subscribe to events, promoting decoupling, flexibility, and extensibility in the
 * system's architecture. The event bus acts as a central hub for event exchange, facilitating efficient and
 * asynchronous communication among different parts of the application.
 */
export abstract class EventBus {
	/**
	 * Dispatch event to all subscribed handlers, this method uses "fire-and-forget" methods which makes the whole
	 *  process asynchronous.
	 */
	abstract dispatch(event : SystemEvent) : Promise<void> | void
	
	abstract handle(event : SystemEvent) : Promise<void>
	
	abstract subscribe<T extends SystemEvent>(event : MessageConstructor<T>,
		handler : EventHandler<T>,
	) : Promise<void> | void
	
	abstract unsubscribe<T extends SystemEvent>(event : MessageConstructor<T>,
		handler : EventHandler<T>,
	) : Promise<void> | void
}
