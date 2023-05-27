import { kebabSpace } from '../../../utils/kebab-space.js'
import { UniqueId } from '../../indexing/unique-id.js'
import { nanoid } from 'nanoid'

export abstract class SimpleEvent {
	public readonly _id: UniqueId = nanoid(256)
	public readonly _occurredOn: Date = new Date()
	public readonly _type: string = kebabSpace(this.constructor.name)

	protected constructor() {}

	static get type(): string {
		return kebabSpace(this.constructor.name)
	}
}
