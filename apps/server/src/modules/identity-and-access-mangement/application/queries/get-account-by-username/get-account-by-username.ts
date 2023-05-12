import { Query } from '../../../../../shared/core/cqrs/query/query'

export class GetAccountByUsername extends Query {
	constructor(public readonly username: string) {
		super()
	}
}
