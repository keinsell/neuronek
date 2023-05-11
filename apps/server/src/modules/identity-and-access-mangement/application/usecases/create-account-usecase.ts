import { ok, Result } from 'neverthrow'
import { UniqueId } from '../../../../shared/core/indexing/unique-id'
import { Usecase } from '../../../../shared/core/usecase'
import { Account } from '../../domain/entities/account'
import { Identity } from '../../domain/identity'
import { CreateAccount } from '../commands/create-account/create-account'

export class CreateAccountUsecase extends Usecase<CreateAccount, UniqueId, any> {
	public async execute(command: CreateAccount): Promise<Result<UniqueId, any>> {
		const account = new Account({
			publicKey: command.publicKey,
			username: command.username
		})

		const identity = new Identity(account)

		identity.create()

		// TODO: Publish events to Event Bus
		console.log(identity.events.map(event => event.eventName()))

		identity.clearEvents()

		return ok(identity.id)
	}
}
