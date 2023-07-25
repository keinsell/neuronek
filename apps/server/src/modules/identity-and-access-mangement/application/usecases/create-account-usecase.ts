import { Err, Ok, UseCase } from 'escentia'
import { Account } from '~domain/iam/domain/entities/account.js'
import { PolicyViolation } from '~foundry/exceptions/policy-violation.js'
import { IdentityAndAccessCommandBus } from '../bus/identity-and-access-command.bus.js'
import { IdentityAndAccessQueryBus } from '../bus/identity-and-access-query-bus.js'
import { CreateAccount } from '../commands/create-account/create-account'
import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username'



export class CreateAccountUsecase
  extends UseCase<CreateAccount, Account, PolicyViolation> {
  constructor(
    private readonly queryBus: IdentityAndAccessQueryBus, private readonly commandBus: IdentityAndAccessCommandBus) {
    super()
  }

  public async execute(command: CreateAccount) {
    const getAccountByUsernameQuery = new FindAccountByUsername(command.username)

    const fetchExistingAccount = await this.queryBus.handle(getAccountByUsernameQuery)

    if (fetchExistingAccount) {
      return Err(new PolicyViolation(409, 'CreateAccountWhenAccountWasNotCreatedBefore'))
    }

    const account = await this.commandBus.handle(command)

    return Ok(account)
  }
}
