import { UniqueId } from '../indexing/unique-id.js'
import { Aggregate } from './aggregate.js'
import { DomainEvent } from './domain-event.js'
import { Entity } from './enity.js'

export abstract class AggregateRoot<T extends Entity | Aggregate> {
	protected readonly _id: UniqueId | undefined
	protected root: T

	protected constructor(root: T, version?: number) {
		this._id = root._id
		this._version = version || 0
		this._events = []
		this.root = root
	}

	protected _version: number

	public get version(): number {
		return this._version
	}

	protected _events: DomainEvent<T>[]

	public get events(): DomainEvent<T>[] {
		return this._events
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
