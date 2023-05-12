import { err, ok, Result } from 'neverthrow'
import { UniqueId } from '../../../../shared/core/indexing/unique-id'
import { Usecase } from '../../../../shared/core/usecase'
import { Account } from '../../domain/entities/account'
import { Identity } from '../../domain/identity'
import { IamEventBus } from '../bus/iam.event-bus'
import { IamQueryBus } from '../bus/iam.query-bus'
import { CreateAccount } from '../commands/create-account/create-account'
import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username'

export class CreateAccountUsecase extends Usecase<CreateAccount, UniqueId, any> {
	constructor(private readonly queryBus: IamQueryBus, private readonly eventBus: IamEventBus) {
		super()
	}

	public async execute(command: CreateAccount): Promise<Result<UniqueId, string>> {
		const getAccountByUsernameQuery = new FindAccountByUsername(command.username)
		const fetchExistingAccount = await this.queryBus.handle<Account>(getAccountByUsernameQuery)

		if (fetchExistingAccount) {
			return err(`Account with username ${command.username} already exists`)
		}

		const account = new Account({
			publicKey: command.publicKey,
			username: command.username
		})

		const identity = new Identity(account)
		identity.create()

		await this.eventBus.sendMultiple(identity.events)

		const fetchAccount = await this.queryBus.handle<Account>(getAccountByUsernameQuery)

		return ok(fetchAccount._id!)
	}
}
