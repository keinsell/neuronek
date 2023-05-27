import { Account } from '../../domain/entities/account.js'
import { createPasswordHash } from '../../domain/value-objects/password-hash.js'
import { createUsername } from '../../domain/value-objects/username/username.js'
import { Account as DatabaseRecord } from '@prisma/client'
import { Mapper } from '~foundry/persistence/mapper.js'

export class AccountDataMapper extends Mapper<Account, DatabaseRecord> {
	public map(input: Account): DatabaseRecord {
		return {
			id: input.id as string,
			username: input.username as string,
			password: input.password as string
		}
	}

	public async inverse(input: DatabaseRecord): Promise<Account> {
		return new Account(
			{
				password: await createPasswordHash(input.password as string),
				username: await createUsername(input.username as string)
			},
			input.id
		)
	}
}
