import { IntegrationEvent } from './integration-event.js'

export abstract class EventHandler<T extends IntegrationEvent = IntegrationEvent> {
	async handle(event: T): Promise<void> {
		console.log(`Handling ${event.constructor.name} with ${this.constructor.name}`)
		await this.execute(event)
	}

	protected abstract execute(event: T): Promise<void>
}
