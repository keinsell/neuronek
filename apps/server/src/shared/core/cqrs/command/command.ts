import { nanoid } from 'nanoid'
import { UniqueId } from '../../indexing/unique-id.js'

export abstract class Command {
	constructor(public readonly id: UniqueId = nanoid()) {}
}
