import { UniqueId } from '../../indexing/unique-id.ts'
import { kebabCase } from 'lodash'
import { nanoid } from 'nanoid'

export abstract class IntegrationEvent {
	public readonly _id: UniqueId = nanoid(256)
	public readonly _occurredOn: Date = new Date()
	public readonly _name: string = kebabCase(this.constructor.name)

	protected constructor(name: string) {
		this._name = name
	}

	static get eventName(): string {
		return kebabCase(this.constructor.name)
	}
}
