import { Entity } from '../domain/enity'
import { UniqueId } from '../indexing/unique-id'

/**
 * The `WriteRepository` interface defines the methods required to store and retrieve entities in a write model.
 * It provides an abstraction layer over the data persistence mechanism, allowing for flexibility in implementation.
 */
export abstract class WriteRepository<T extends Entity> {
	/**
	 * Saves an entity to the write model.
	 * @param entity The entity to be saved.
	 * @returns A `Promise` that resolves with the saved entity.
	 */
	public abstract save(aggregate: T): Promise<T>

	/**
	 * Deletes an entity from the write model.
	 * @param id The unique identifier of the entity to be deleted.
	 * @returns A `Promise` that resolves with a boolean indicating whether the entity was successfully deleted.
	 */
	public abstract delete(id: UniqueId): Promise<boolean>
}
