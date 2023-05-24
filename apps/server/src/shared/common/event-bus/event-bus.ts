import { IntegrationEvent } from '../../core/cqrs/event/integration-event.js'

/**
 * Event bus is to enable loosely coupled communication between components or modules in a software system. It
 * allows components to publish and subscribe to events, promoting decoupling, flexibility, and extensibility in the system's architecture. The event bus acts as a central hub for event exchange, facilitating efficient and asynchronous communication among different parts of the application.
 */
export abstract class EventBus {
	abstract dispatch(event: IntegrationEvent): Promise<void>

	async dispatchMany(events: IntegrationEvent[]): Promise<void> {
		for await (const event of events) {
			await this.dispatch(event)
		}
	}

	/** Ensures event is handled */
	abstract handle(event: IntegrationEvent): Promise<void>
}
