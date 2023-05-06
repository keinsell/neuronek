import { Message } from './message'

interface MessageBinding {
	messageType: string
	queueName: string
}

interface MessageRouter {
	addBinding(binding: MessageBinding): void

	removeBinding(binding: MessageBinding): void

	route<T>(message: Message<T>): Promise<void>
}
