import { UniqueId } from '../indexing/unique-id'

export abstract class Aggregate {
	public readonly _id: UniqueId | undefined

	protected constructor(id?: string) {
		this._id = id
	}
}
