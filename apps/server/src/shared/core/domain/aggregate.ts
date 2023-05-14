import { UniqueId } from '../indexing/unique-id'
import { IdentifierMissing } from './exceptions/identifier-missing'

export abstract class Aggregate {
	public readonly _id: UniqueId | undefined

	protected constructor(id?: string) {
		this._id = id
	}

	get id(): UniqueId {
		if (!this._id) {
			throw new IdentifierMissing(this.constructor.name)
		}
		return this._id
	}
}
