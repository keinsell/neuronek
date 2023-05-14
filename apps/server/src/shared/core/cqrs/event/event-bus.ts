import { SimpleEvent } from './simple-event'

export abstract class EventBus {
	abstract send(event: SimpleEvent<unknown>): Promise<void>
	async sendMultiple(events: SimpleEvent<unknown>[]): Promise<void> {
		for await (const event of events) {
			await this.send(event)
		}
	}
}
