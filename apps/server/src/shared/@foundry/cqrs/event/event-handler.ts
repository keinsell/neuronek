import { SimpleEvent } from './simple-event.js'



export abstract class EventHandler<T extends SimpleEvent = SimpleEvent> {
	async handle(event: T): Promise<void> {
		console.log(`Handling ${event.constructor.name} with ${this.constructor.name}`)
		await this.execute(event)
	}

	protected abstract execute(event: T): Promise<void>
}
