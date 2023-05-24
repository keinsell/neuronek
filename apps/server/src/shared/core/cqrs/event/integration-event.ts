import { UniqueId } from '../../indexing/unique-id'
import { nanoid } from 'nanoid'

export abstract class IntegrationEvent {
	public readonly _id: UniqueId = nanoid(256)
	public readonly _occurredOn: Date = new Date()
	public readonly _name: string

	protected constructor(name: string) {
		this._name = name
	}
}
