import { UniqueId } from '../../indexing/unique-id'


// TODO: Current state of system do not require such.
export abstract class ReadModel {
	readonly id: UniqueId

	constructor(id: UniqueId) {
		this.id = id
	}

	abstract toJSON(): Record<string, unknown>
}
