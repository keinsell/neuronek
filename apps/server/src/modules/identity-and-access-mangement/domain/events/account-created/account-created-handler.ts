import { EventHandler } from '../../../../../shared/core/cqrs/event/event-handler'
import { AccountWriteRepository } from '../../../infrastructure/repositories/account.write-repository'
import { AccountCreated } from './account-created'

export class AccountCreatedHandler extends EventHandler {
	public async execute(event: AccountCreated): Promise<void> {
		await new AccountWriteRepository().save(event.account)
	}
}
