import { kebabSpace } from '../../utils/kebab-space.js'
import { cuid, CUID } from '~foundry/indexing/cuid.js'

/**
 * The Message interface defines a common structure for messages that are exchanged between different services in a message-based architecture.
 */
interface MessageProperties<T> {
	id: string
	correlationId?: string
	messageType: string
	payload: T
	headers?: Record<string, string>
	metadata?: Record<string, any>
}

export class Message<T> implements MessageProperties<T> {
	id: CUID = cuid()
	correlationId?: string
	messageType: string
	payload: T
	headers?: Record<string, string>
	metadata?: Record<string, any>

	constructor(message: Omit<MessageProperties<T>, 'id'>) {
		Object.assign(this, message)
	}

	static type(): string {
		return kebabSpace(this.name)
	}
}

export type MessageConstructor<T = unknown> = new (...args: any[]) => Message<T>
