import { UniqueId } from '../indexing/unique-id'
import { DomainEvent } from './domain-event.js'
import { Entity } from './enity'

export abstract class AggregateRoot<T extends Entity> {
	protected readonly _id: UniqueId
	_events: DomainEvent[]
	protected _version: number
	protected _entity: T

	constructor(entity: T, version?: number) {
		this._id = entity.id
		this._version = version || 0
		this._events = []
		this._entity = entity
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

	public addEvent(event: DomainEvent): void {
		this._events.push(event)
		this.incrementVersion()
	}

	public clearEvents(): void {
		this._events.length = 0
	}

	private incrementVersion(): void {
		this._version++
	}
}
