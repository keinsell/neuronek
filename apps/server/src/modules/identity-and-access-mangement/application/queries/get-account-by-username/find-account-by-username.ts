import { Query } from '~foundry/cqrs'

export class FindAccountByUsername extends Query {
	constructor(public readonly username: string) {
		super()
	}
}
