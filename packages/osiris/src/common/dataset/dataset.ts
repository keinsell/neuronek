export abstract class Dataset<Entity> {
	public entities: Entity[]

	constructor(entities: Entity[]) {
		this.entities = entities
	}
}
