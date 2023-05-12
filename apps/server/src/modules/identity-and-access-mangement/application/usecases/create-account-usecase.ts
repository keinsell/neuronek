import { ok, Result } from 'neverthrow'
import { UniqueId } from '../../../../shared/core/indexing/unique-id'
import { Usecase } from '../../../../shared/core/usecase'
import { Account } from '../../domain/entities/account'
import { Identity } from '../../domain/identity'
import { IamEventBus } from '../bus/iam.event-bus'
import { IamQueryBus } from '../bus/iam.query-bus'
import { CreateAccount } from '../commands/create-account/create-account'
import { GetAccountByUsername } from '../queries/get-account-by-username/get-account-by-username'

export class CreateAccountUsecase extends Usecase<CreateAccount, UniqueId, any> {
	public async execute(command: CreateAccount): Promise<Result<UniqueId, any>> {
		const account = new Account({
			publicKey: command.publicKey,
			username: command.username
		})

		const identity = new Identity(account)

		identity.create()

		await new IamEventBus().sendMultiple(identity.events)

		identity.clearEvents()

		const query = new GetAccountByUsername(command.username)
		const createdAccount = await new IamQueryBus().handle<Account>(query)

		console.log(createdAccount)

		return ok(createdAccount._id!)
	}
}
