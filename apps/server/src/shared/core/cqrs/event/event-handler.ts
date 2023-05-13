import { SimpleEvent } from './simple-event'

export abstract class EventHandler<T extends SimpleEvent<any>> {
	abstract handle(event: T): Promise<void>
}
