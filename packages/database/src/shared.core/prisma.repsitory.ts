import { PrismaClient } from '@prisma/client'

export class PaginatedDomainModel<T> {
	public data: T[]
	public total: number
}

// Good insiration over there: https://github.com/diego3g/umbriel

/**
 * A bare-bones Prisma repository that can be extended to implement custom domain-specific
 * repository functionality. This repository contains basic CRUD operations that can be used
 * to create a custom repository that is specific to a domain model.
 *
 * The repository does not contain any logic for converting between domain models and
 * storage models. You must implement the `toDomain` and `toStorage` methods in the
 * extended repository to perform this conversion.
 *
 * @param DOMAIN_MODEL The domain model for which the repository is responsible
 * @param CREATE_OR_UPDATE_STORAGE_MODEL The model used to create or update a model in database
 * @param STORAGE_MODEL The model used to store a domain model in the database
 */
export abstract class BarePrismaRepositoryOfOsirisModel<DOMAIN_MODEL, CREATE_OR_UPDATE_STORAGE_MODEL, STORAGE_MODEL> {
	public prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	/**
	 * Converts a storage model to a domain model.
	 * @param storageModel The storage model to convert.
	 * @return The domain model.
	 */
	abstract toDomain(storageModel: STORAGE_MODEL): DOMAIN_MODEL

	/**
	 * This function converts a domain model to a storage model.
	 * @param domainModel The domain model to convert.
	 * @returns A storage model.
	 */
	abstract toStorage(domainModel: DOMAIN_MODEL): CREATE_OR_UPDATE_STORAGE_MODEL

	/**
	 * Returns the domain model with the specified id.
	 * @param id The id of the domain model to return.
	 * @returns A promise that resolves to the domain model with the specified id, or undefined if no domain model with that id exists.
	 */
	abstract findById(id: any): Promise<DOMAIN_MODEL | undefined>

	// Determines whether the given domain model exists.
	//
	// Returns a promise that resolves to true if the domain model exists,
	// false otherwise.
	abstract exists(domainModel: DOMAIN_MODEL): Promise<boolean>

	/**
	 * Save the passed domain model to the database.
	 *
	 * @param domainModel The domain model to save.
	 * @return A promise that resolves to the saved domain model.
	 */
	abstract save(domainModel: DOMAIN_MODEL): Promise<DOMAIN_MODEL>

	/** Returns all instances of {@link DOMAIN_MODEL} */
	abstract all(): Promise<DOMAIN_MODEL[]>

	/** Returns the number of instances in the database */
	abstract count(): Promise<number>

	/** Deletes all instances of {@link DOMAIN_MODEL} */
	abstract deleteAll(): Promise<void>

	/** Deletes a single instance of {@link DOMAIN_MODEL} */
	abstract delete(id: any): Promise<void>
}
