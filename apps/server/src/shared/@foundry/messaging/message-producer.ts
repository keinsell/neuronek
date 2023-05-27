import { Message } from './message'

export abstract class MessageProducer {
	abstract connect(): Promise<void>

	abstract disconnect(): Promise<void>

	abstract send<T>(message: Message<T>): Promise<void>
}
