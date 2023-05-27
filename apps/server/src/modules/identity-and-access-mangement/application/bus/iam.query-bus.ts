import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username'
import { FindAccountByUsernameHandler } from '../queries/get-account-by-username/find-account-by-username.handler'
import { Query, QueryBus } from '~foundry/cqrs'
import { QueryBidning } from '~foundry/cqrs/query/query-bidning.js'

export class IamQueryBus extends QueryBus {
	bindings: QueryBidning[] = [
		{
			handler: new FindAccountByUsernameHandler(),
			query: FindAccountByUsername
		}
	]

	public async handle<RESPONSE = any>(query: Query): Promise<RESPONSE> {
		const binding = this.bindings.find(b => b.query.name === query.constructor.name)

		if (binding) {
			return await binding.handler.execute(query)
		} else {
			throw new Error(`No binding found for event "${query.constructor.name}"`)
		}
	}
}
