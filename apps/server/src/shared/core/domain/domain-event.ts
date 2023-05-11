export abstract class DomainEvent<T = unknown> {
	readonly occurredOn: Date
	readonly payload: T

	protected constructor(payload: T) {
		this.occurredOn = new Date()
		this.payload = payload
	}

	abstract eventName(): string
}
