import { EventHandler } from './event-handler.js'
import { SimpleEvent }  from './simple-event.js'



/**
 * Event bus is to enable loosely coupled communication between components or modules in a software system. It
 * allows components to publish and subscribe to events, promoting decoupling, flexibility, and extensibility in the system's architecture. The event bus acts as a central hub for event exchange, facilitating efficient and asynchronous communication among different parts of the application.
 */
export abstract class EventBus {
	/**
	 * Dispatch event to all subscribed handlers, this method uses "fire-and-forget" methods which makes the whole
	 *  process asynchronous.
	 */
	abstract dispatch(event: SimpleEvent): Promise<void> | void

	abstract handle(event: SimpleEvent): Promise<void>

	abstract subscribe<T extends SimpleEvent>(
		eventClass: new (...args: any[]) => T,
		handler: EventHandler
	): Promise<void> | void

	abstract unsubscribe<T extends SimpleEvent>(
		eventClass: new (...args: any[]) => T,
		handler: EventHandler
	): Promise<void> | void
}
