import { UniqueId } from '../indexing/unique-id'
import { DomainEvent } from './domain-event.js'
import { Entity } from './enity'

export abstract class AggregateRoot<T extends Entity> {
	protected readonly _id: UniqueId
	protected readonly _version: number
	protected readonly _events: DomainEvent[]

	constructor(id: UniqueId, version: number) {
		this._id = id
		this._version = version
		this._events = []
	}

	public get id(): UniqueId {
		return this._id
	}

	public get version(): number {
		return this._version
	}

	public get events(): DomainEvent[] {
		return this._events
	}

	public abstract create(): T

	public addEvent(event: DomainEvent): void {
		this._events.push(event)
	}

	public clearEvents(): void {
		this._events.length = 0
	}
}
