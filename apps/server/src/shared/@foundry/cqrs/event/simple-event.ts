import { kebabSpace }     from '../../../utils/kebab-space.js'
import { nanoid, NanoID } from '../../indexing/nanoid/index.js'



export abstract class SimpleEvent {
	public readonly _id : NanoID = nanoid()
	public readonly _occurredOn : Date = new Date()
	public readonly _type : string = kebabSpace( this.constructor.name )
	
	protected constructor() {
	}
	
	static get type() : string {
		return kebabSpace( this.constructor.name )
	}
}
