import { Entity } from './enity.js'
import { DomainEvent } from './domain-event.js'

export abstract class AggregateRoot<T extends Entity> {
	protected readonly _id: string
	protected readonly _version: number
	protected readonly _events: DomainEvent[]

	constructor(id: string) {
		this._id = id
		this._version = 0
		this._events = []
	}

	public get id(): string {
		return this._id
	}

	public get version(): number {
		return this._version
	}

	public get events(): any[] {
		return this._events
	}

	public abstract createNew(): T

	public addEvent(event: any): void {
		this._events.push(event)
	}

	public clearEvents(): void {
		this._events.length = 0
	}
}
