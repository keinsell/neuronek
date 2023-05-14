import { nanoid } from 'nanoid'
import { UniqueId } from '../../indexing/unique-id'

export abstract class SimpleEvent<T> {
	public readonly id: UniqueId = nanoid(256)
	public readonly occurredOn: Date = new Date()
	constructor(public readonly payload: T) {}

	abstract get name(): string
}
