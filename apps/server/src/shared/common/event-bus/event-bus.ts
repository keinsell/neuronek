import { IntegrationEvent } from '../../core/cqrs/event/integration-event.js'

export abstract class EventBus {
	abstract dispatch(event: IntegrationEvent): Promise<void>

	async dispatchMultiple(events: IntegrationEvent[]): Promise<void> {
		for await (const event of events) {
			await this.dispatch(event)
		}
	}
}
