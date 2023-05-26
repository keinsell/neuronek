import { EventHandler } from './event-handler.js'
import { IntegrationEvent } from './integration-event.js'

/**
 * Event bus is to enable loosely coupled communication between components or modules in a software system. It
 * allows components to publish and subscribe to events, promoting decoupling, flexibility, and extensibility in the system's architecture. The event bus acts as a central hub for event exchange, facilitating efficient and asynchronous communication among different parts of the application.
 */
export abstract class EventBus {
	/**
	 * Dispatch event to all subscribed handlers, this method uses "fire-and-forget" methods which makes the whole
	 *  process asynchronous.
	 */
	abstract dispatch(event: IntegrationEvent): Promise<void>

	abstract handle(event: IntegrationEvent): Promise<void>

	abstract subscribe(event: IntegrationEvent, handler: EventHandler): Promise<void> | void

	abstract unsubscribe(event: IntegrationEvent, eventHandler: EventHandler): Promise<void> | void
}
