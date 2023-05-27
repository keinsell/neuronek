import { AccountWriteRepository } from '../../../infrastructure/repositories/account.write-repository.js'
import { UsernameChanged } from './username-changed.js'
import { DomainHandler } from '~foundry/domain'

export class UsernameChangedHandler extends DomainHandler {
	public async execute(event: UsernameChanged): Promise<void> {
		await new AccountWriteRepository().save(event.account)
	}
}
