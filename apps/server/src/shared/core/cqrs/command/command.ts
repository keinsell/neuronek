import { nanoid } from 'nanoid'
import { UniqueId } from '../../indexing/unique-id.js'

export abstract class Command {
	protected constructor(public readonly id: UniqueId = nanoid()) {}
}
