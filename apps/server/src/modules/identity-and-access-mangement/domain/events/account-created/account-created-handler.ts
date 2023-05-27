import { AccountWriteRepository } from '../../../infrastructure/repositories/account.write-repository'
import { AccountCreated } from './account-created'
import { DomainHandler } from '~foundry/domain'

export class AccountCreatedHandler extends DomainHandler<AccountCreated> {
	public async handle(event: AccountCreated): Promise<void> {
		await new AccountWriteRepository().save(event.account)
	}
}
