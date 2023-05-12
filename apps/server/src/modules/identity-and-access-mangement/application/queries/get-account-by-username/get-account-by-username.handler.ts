import { QueryHandler } from '../../../../../shared/core/cqrs/query/query-handler'
import { AccountReadRepository } from '../../../infrastructure/repositories/account.read-repository'
import { GetAccountByUsername } from './get-account-by-username'

export class GetAccountByUsernameHandler extends QueryHandler<GetAccountByUsername> {
	public async execute(query: GetAccountByUsername): Promise<GetAccountByUsername> {
		const repository = new AccountReadRepository()
		const account = await repository.findByUsername(query.username)

		if (account) {
			console.log(`${this.constructor.name} handling query: ${query.constructor.name}`)
			console.log(`Found account: ${JSON.stringify(account)}`)
			return account
		}

		throw new Error(`No account found for username "${query.username}"`)
	}
}
