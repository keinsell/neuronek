import { Account } from '../../../domain/entities/account'
import { AccountReadRepository } from '../../../infrastructure/repositories/account.read-repository'
import { FindAccountByUsername } from './find-account-by-username'
import { QueryHandler } from '~foundry/cqrs'

export class FindAccountByUsernameHandler extends QueryHandler<Account | null> {
	public async handle(query: FindAccountByUsername): Promise<Account | null> {
		const repository = new AccountReadRepository()
		const account = await repository.findByUsername(query.username)

		if (account) {
			console.log(`${this.constructor.name} handling query: ${query.constructor.name}`)
			console.log(`Found account: ${JSON.stringify(account)}`)
			return account
		} else {
			console.log(`${this.constructor.name} handling query: ${query.constructor.name}`)
			console.log(`Account not found for username: ${query.username}`)
			return null
		}
	}
}
