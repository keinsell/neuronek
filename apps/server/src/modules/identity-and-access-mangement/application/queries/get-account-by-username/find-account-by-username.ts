import { Query }   from '~foundry/cqrs'
import { Account } from '../../../domain/entities/account.js'



export class FindAccountByUsername
	extends Query<Account | null> {
	constructor(public readonly username: string) {
		super()
	}
}
