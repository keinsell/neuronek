import { Entity } from '../domain/enity'
import { UniqueId } from '../indexing/unique-id'

/**
 * The `QueryRepository` interface defines the methods required to retrieve entities from a read model.
 * It provides an abstraction layer over the data persistence mechanism, allowing for flexibility in implementation.
 */
export abstract class QueryRepository<T extends Entity> {
	/**
	 * Finds an entity in the read model by its unique identifier.
	 * @param id The unique identifier of the entity to be found.
	 * @returns A `Promise` that resolves with the found entity, or `null` if the entity was not found.
	 */
	public abstract findById(id: UniqueId): Promise<T | null>

	/**
	 * Finds all entities in the read model.
	 * @returns A `Promise` that resolves with an array of all entities in the read model.
	 */
	public abstract findAll(): Promise<T[]>
}
