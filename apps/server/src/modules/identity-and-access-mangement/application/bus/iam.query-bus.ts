import { Query } from '../../../../shared/core/cqrs/query/query'
import { QueryBidning } from '../../../../shared/core/cqrs/query/query-bidning'
import { QueryBus } from '../../../../shared/core/cqrs/query/query-bus'
import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username'
import { FindAccountByUsernameHandler } from '../queries/get-account-by-username/find-account-by-username.handler'

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
