/**
 * The Message interface defines a common structure for messages that are exchanged between different services in a message-based architecture.
 */
export interface Message<T> {
	id: string
	correlationId?: string
	messageType: string
	payload: T
	headers?: Record<string, string>
	metadata?: Record<string, any>
}
