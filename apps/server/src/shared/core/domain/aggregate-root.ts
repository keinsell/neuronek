import { UniqueId } from '../indexing/unique-id'
import { Aggregate } from './aggregate'
import { DomainEvent } from './domain-event.js'
import { Entity } from './enity'

export abstract class AggregateRoot<T extends Entity | Aggregate> {
	protected readonly _id: UniqueId | undefined
	protected _version: number
	protected _entity: T

	protected constructor(entity: T, version?: number) {
		this._id = entity._id
		this._version = version || 0
		this._events = []
		this._entity = entity
	}

	protected _events: DomainEvent<T>[]

	public get events(): DomainEvent<T>[] {
		return this._events
	}

	public get version(): number {
		return this._version
	}

	public get id(): UniqueId {
		if (!this._id) {
			throw new Error('Aggregate is not persisted in database.')
		}

		return this._id
	}

	public addEvent(event: DomainEvent<T>): void {
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
