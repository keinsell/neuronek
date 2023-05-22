import { PolicyViolation } from '../../../../shared/core/domain/exceptions/policy-violation.js'
import { UniqueId } from '../../../../shared/core/indexing/unique-id'
import { left, Result, right } from '../../../../shared/core/technical/result'
import { UseCase } from '../../../../shared/core/use-case.js'
import { Account } from '../../domain/entities/account'
import { Identity } from '../../domain/identity'
import { IamEventBus } from '../bus/iam.event-bus'
import { IamQueryBus } from '../bus/iam.query-bus'
import { CreateAccount } from '../commands/create-account/create-account'
import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username'

export class CreateAccountUsecase extends UseCase<CreateAccount, UniqueId, PolicyViolation> {
	constructor(private readonly queryBus: IamQueryBus, private readonly eventBus: IamEventBus) {
		super()
	}

	public async execute(command: CreateAccount): Promise<Result<PolicyViolation, UniqueId>> {
		const getAccountByUsernameQuery = new FindAccountByUsername(command.username)
		const fetchExistingAccount = await this.queryBus.handle<Account>(getAccountByUsernameQuery)

		if (fetchExistingAccount) {
			return left(new PolicyViolation(409, 'CreateAccountWhenAccountWasNotCreatedBefore'))
		}

		const account = new Account({
			publicKey: command.publicKey,
			username: command.username
		})

		const identity = new Identity(account)

		identity.create()

		await this.eventBus.sendMultiple(identity.events)

		const fetchAccount = await this.queryBus.handle<Account>(getAccountByUsernameQuery)

		return right(fetchAccount._id!)
	}
}
