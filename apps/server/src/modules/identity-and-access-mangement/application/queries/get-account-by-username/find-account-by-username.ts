import { Query } from '../../../../../shared/core/cqrs/query/query'

export class FindAccountByUsername extends Query {
	constructor(public readonly username: string) {
		super()
	}
}
