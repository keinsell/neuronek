import { UniqueId } from '../indexing/unique-id'

/**
 * Entities are pretty much the bread and butter of domain modeling.
 *
 * They are the objects that represent the data that is being manipulated by the application.
 *
 * @version 1.0.0
 * @author Jakub "keinsell" Olan <keinsell@protonmail.com>
 * @see [Understanding Domain Entities](https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/)
 */
export abstract class Entity {
	/** Automatically generated (or imported) id of specific entity. Used to reference right object in persistence layer. */
	public readonly _id: UniqueId | undefined
	protected constructor(id?: UniqueId | undefined) {
		this._id = id
	}
}
