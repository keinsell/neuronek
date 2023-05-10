import { Message } from './message'

interface MessageBinding {
	messageType: string
	queueName: string
}

// TODO: Probably abstract class would be better
export interface MessageRouter {
	addBinding(binding: MessageBinding): void

	removeBinding(binding: MessageBinding): void

	route<T>(message: Message<T>): Promise<void>
}
