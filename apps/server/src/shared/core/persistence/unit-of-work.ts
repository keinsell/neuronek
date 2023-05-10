/**
 * Unit of Work is a design pattern that helps ensure data consistency when working with multiple
 * repositories in a single transaction. It provides methods for committing or rolling back a transaction
 * that affects multiple repositories.
 *
 * A Unit of Work abstract class should define methods for each repository that it manages.
 */
export abstract class UnitOfWork {
	abstract withTransaction<T>(work: () => Promise<T>): Promise<T>
}
