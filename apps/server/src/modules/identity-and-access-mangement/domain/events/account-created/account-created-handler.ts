import { EventHandler } from '../../../../../shared/core/cqrs/event/event-handler'
import { AccountWriteRepository } from '../../../infrastructure/repositories/account.write-repository'
import { AccountCreated } from './account-created'

export class AccountCreatedHandler extends EventHandler<AccountCreated> {
	public async handle(event: AccountCreated): Promise<void> {
		console.log(`${this.constructor.name} handling event: ${event.constructor.name}`)
		await new AccountWriteRepository().save(event.payload)
	}
}
