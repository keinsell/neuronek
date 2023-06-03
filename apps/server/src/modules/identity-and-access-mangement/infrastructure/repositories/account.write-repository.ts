import { UniqueId }        from '../../../../shared/@foundry/indexing/unique-id.js'
import { WriteRepository } from '../../../../shared/@foundry/persistence/write-repository.js'
import { prisma }          from '../../../../shared/infrastructure/prisma/prisma'
import { Account }         from '../../domain/entities/account'



export class AccountWriteRepository extends WriteRepository<Account> {
	private prisma = prisma

	public async save(entity: Account): Promise<Account> {
		if (entity._id) {
			// Existing account, perform update
			await this.prisma.account.update({
				where: { id: entity._id as string },
				data: { password: entity.password, username: entity.username }
			})
			return entity
		} else {
			// New account, perform creation
			const account = await this.prisma.account.create({
				data: { ...entity, id: undefined }
			})
			return new Account(
				{
					password: entity.password,
					username: account.username
				},
				account.id
			)
		}
	}

	public async delete(id: UniqueId): Promise<boolean> {
		try {
			await this.prisma.account.delete({ where: { id: id as string } })
			return true
		} catch (error) {
			return false
		}
	}
}
