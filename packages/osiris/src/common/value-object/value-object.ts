export abstract class ValueObject<PROPERTIES> {
	/** Automatically generated (or imported) id of specific entity. Used to reference right object in persistence layer. */
	protected properties: PROPERTIES
	constructor(properties: PROPERTIES) {
		this.properties = properties
	}
}
