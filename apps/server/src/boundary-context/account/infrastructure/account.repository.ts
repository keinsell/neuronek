import { Account } from '../account'

export abstract class AccountRepository {
	abstract save(account: Account): Promise<void>
}
