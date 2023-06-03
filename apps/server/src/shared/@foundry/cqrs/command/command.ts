import { kebabSpace }     from '../../../utils/kebab-space.js'
import { nanoid, NanoID } from '../../indexing/nanoid/index.js'
import { UniqueId }       from '../../indexing/unique-id.js'



export abstract class Command {
	public readonly _id : NanoID
	public readonly _timestamp : Date
	public readonly _causationId? : UniqueId
	public readonly _correlationId? : UniqueId
	public readonly _type : string
	
	protected constructor(causationId? : UniqueId, correlationId? : UniqueId, id? : NanoID) {
		this._causationId = causationId
		this._correlationId = correlationId
		this._id = id || nanoid( undefined, 256 )
		this._timestamp = new Date()
		this._type = kebabSpace( this.constructor.name )
	}
	
	static get type() {
		return kebabSpace( this.name )
	}
}
