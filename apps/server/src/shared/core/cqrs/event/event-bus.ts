import { Event } from './event'

export abstract class EventBus {
	abstract send(event: Event<unknown>): Promise<void>
	async sendMultiple(events: Event<unknown>[]): Promise<void> {
		for await (const event of events) {
			await this.send(event)
		}
	}
}
