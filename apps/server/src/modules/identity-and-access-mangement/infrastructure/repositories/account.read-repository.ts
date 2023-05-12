import { UniqueId } from '../../../../shared/core/indexing/unique-id'
import { QueryRepository } from '../../../../shared/core/persistence/read-repository'
import { prisma } from '../../../../shared/infrastructure/prisma/prisma'
import { Account } from '../../domain/entities/account'

export class AccountReadRepository implements QueryRepository<Account> {
	public async findAll(): Promise<Account[]> {
		const accounts = await prisma.account.findMany()
		return accounts.map(account => new Account(account))
	}

	public async findById(id: UniqueId): Promise<Account | null> {
		const account = await prisma.account.findUnique({ where: { id: id as string } })
		return account ? new Account(account, account.id) : null
	}

	public async findByUsername(username: string): Promise<Account | null> {
		const account = await prisma.account.findUnique({ where: { username } })
		return account ? new Account(account, account.id) : null
	}
}
