import { Entity }    from '../domain/enity.js'
import { Exception } from './exception.js'



/**
 * IdentifierMissing is responsible for when identifier is missing, this is mostly a case where we decide to save
 *  something in async way.
 */
export class IdentifierMissing extends Exception {
	constructor(entity: Entity<any>) {
		super({
			statusCode: 422,
			message: `Identifier of ${entity.constructor.name} is missing. Perhaps system delayed write to database because high load, please try again or wait a little moment and check if your action has been made.`
		})
	}
}
