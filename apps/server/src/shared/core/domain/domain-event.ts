export abstract class DomainEvent {
	readonly occurredOn: Date

	constructor() {
		this.occurredOn = new Date()
	}

	abstract eventName(): string
}
