import { nanoid } from 'nanoid'
import { UniqueId } from 'server/src/shared/core/indexing/unique-id'

/** Entity represents objects that most likely should be saved into database. This modified version aims to introduce additional property which is `id` for easier manipulating data when used in database. */
export class Entity {
	public readonly id: UniqueId

	constructor(id?: UniqueId) {
		this.id = id || nanoid()
	}
}
