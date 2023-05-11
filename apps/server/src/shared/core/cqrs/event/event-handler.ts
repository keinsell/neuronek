import { Event } from './event'

export abstract class EventHandler<T extends Event<any>> {
	abstract handle(event: T): Promise<void>
}
