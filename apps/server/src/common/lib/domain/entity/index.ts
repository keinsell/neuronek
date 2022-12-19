import { nanoid } from "nanoid";

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
	id: any;
	constructor(id?: any) {
		this.id = id ?? nanoid();
	}
}
