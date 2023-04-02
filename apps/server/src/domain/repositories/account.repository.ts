import { Account } from '../aggregates/account'

export abstract class AccountRepository {
	abstract save(account: Account): Promise<void>
}
