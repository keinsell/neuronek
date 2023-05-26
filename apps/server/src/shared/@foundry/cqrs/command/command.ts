import { UniqueId } from '../../indexing/unique-id.js'
import { kebabCase } from 'lodash'
import { nanoid } from 'nanoid'

export abstract class Command {
	public readonly _id: UniqueId
	public readonly _timestamp: Date
	public readonly _causationId?: UniqueId
	public readonly _correlationId?: UniqueId
	public readonly _type: string

	protected constructor(causationId?: UniqueId, correlationId?: UniqueId, id?: UniqueId) {
		this._causationId = causationId
		this._correlationId = correlationId
		this._id = id || nanoid(256)
		this._timestamp = new Date()
		this._type = kebabCase(this.constructor.name)
	}
}
