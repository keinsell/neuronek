import { Message } from './message'

export interface MessageProducer {
	send<T>(message: Message<T>): Promise<void>
}
