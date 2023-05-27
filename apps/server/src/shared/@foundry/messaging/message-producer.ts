import { Message } from '~foundry/messaging/message.js'

export abstract class MessageProducer {
	abstract connect(): Promise<void>

	abstract disconnect(): Promise<void>

	abstract send<T = unknown>(message: Message<T>): Promise<void>
}
