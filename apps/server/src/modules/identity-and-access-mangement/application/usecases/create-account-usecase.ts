import { PolicyViolation } from '../../../../shared/core/domain/exceptions/policy-violation.js'
import { UniqueId } from '../../../../shared/core/indexing/unique-id'
import { left, Result, right } from '../../../../shared/core/technical/result'
import { UseCase } from '../../../../shared/core/use-case.js'
import { Account } from '../../domain/entities/account'
import { Identity } from '../../domain/identity'
import { hashPassword } from '../../domain/value-objects/password.js'
import { IamQueryBus } from '../bus/iam.query-bus'
import { IdentityAndAccessCommandBus } from '../bus/identity-and-access-command.bus.js'
import { IdentityAndAccessEventBus } from '../bus/identity-and-access-event.bus.js'
import { CreateAccount } from '../commands/create-account/create-account'
import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username'

export class CreateAccountUsecase extends UseCase<CreateAccount, UniqueId, PolicyViolation> {
	constructor(private readonly queryBus: IamQueryBus, private readonly eventBus: IdentityAndAccessEventBus) {
		super()
	}

	public async execute(command: CreateAccount): Promise<Result<PolicyViolation, UniqueId>> {
		const getAccountByUsernameQuery = new FindAccountByUsername(command.username)
		const fetchExistingAccount = await this.queryBus.handle<Account>(getAccountByUsernameQuery)

		if (fetchExistingAccount) {
			return left(new PolicyViolation(409, 'CreateAccountWhenAccountWasNotCreatedBefore'))
		}

		await new IdentityAndAccessCommandBus().handle(command)

		const passwordHash = await hashPassword(command.password)

		const account = new Account({
			password: passwordHash,
			username: command.username
		})

		const identity = new Identity(account)

		identity.create()

		await this.eventBus.dispatchMultiple(identity.events)

		const fetchAccount = await this.queryBus.handle<Account>(getAccountByUsernameQuery)

		return right(fetchAccount._id!)
	}
}
