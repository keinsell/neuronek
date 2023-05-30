import { EventEmitter } from 'events'
import { MessageProducer } from '~foundry/messaging/message-producer.js'
import { Message } from '~foundry/messaging/message.js'

export class EventEmitterMessageProducer extends MessageProducer {
	private eventEmitter: EventEmitter

	constructor() {
		super()
		this.eventEmitter = new EventEmitter()
	}

	async connect(): Promise<void> {}

	async disconnect(): Promise<void> {}

	async send<T extends Message<unknown>>(message: new (...arguments_: any[]) => T): Promise<void> {
		this.eventEmitter.emit(message.name, new message())
	}
}
