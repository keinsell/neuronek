import { PrismaClient } from '@prisma/client'

export class PaginatedDomainModel<T> {
	public data: T[]
	public total: number
}

// Good insiration over there: https://github.com/diego3g/umbriel

export abstract class BarePrismaRepositoryOfOsirisModel<DOMAIN_MODEL, CREATE_OR_UPDATE_MODEL, STORAGE_MODEL> {
	public prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	abstract toDomain(storageModel: STORAGE_MODEL): DOMAIN_MODEL
	abstract toStorage(domainModel: DOMAIN_MODEL): CREATE_OR_UPDATE_MODEL

	abstract findById(id: any): Promise<DOMAIN_MODEL | undefined>
	abstract exists(domainModel: DOMAIN_MODEL): Promise<boolean>
	abstract save(domainModel: DOMAIN_MODEL): Promise<DOMAIN_MODEL>
	abstract all(): Promise<DOMAIN_MODEL[]>
}
