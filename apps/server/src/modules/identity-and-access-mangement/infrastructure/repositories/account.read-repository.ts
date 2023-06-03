import { UniqueId }          from '../../../../shared/@foundry/indexing/unique-id.js'
import { QueryRepository }   from '../../../../shared/@foundry/persistence/read-repository.js'
import { prisma }            from '../../../../shared/infrastructure/prisma/prisma'
import { Account }           from '../../domain/entities/account'
import { AccountDataMapper } from '../data-mappers/account.data-mapper.js'



export class AccountReadRepository implements QueryRepository<Account> {
	private readonly accountDataMapper: AccountDataMapper

	constructor() {
		this.accountDataMapper = new AccountDataMapper()
	}

	public async findById(id: UniqueId): Promise<Account | null> {
		const account = await prisma.account.findUnique({ where: { id: id as string } })
		return account ? this.accountDataMapper.inverse(account) : null
	}

	public async findAll(): Promise<Account[]> {
		const accounts = await prisma.account.findMany()
		return Promise.all(
			accounts.map(async account => {
				return await this.accountDataMapper.inverse(account)
			})
		)
	}

	public async findByUsername(username: string): Promise<Account | null> {
		const account = await prisma.account.findUnique({ where: { username } })
		return account ? this.accountDataMapper.inverse(account) : null
	}
}
