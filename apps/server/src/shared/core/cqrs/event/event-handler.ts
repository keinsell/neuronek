import { SimpleEvent } from './simple-event'

export abstract class EventHandler<T extends SimpleEvent<any>> {
	abstract execute(event: T): Promise<void>
	async handle(event: T): Promise<void> {
		console.log(`Handling ${event.constructor.name} with ${this.constructor.name}`)
		await this.execute(event)
	}
}
