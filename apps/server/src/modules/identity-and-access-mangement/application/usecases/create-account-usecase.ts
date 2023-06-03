import { DomainEvent, UseCase }      from '~foundry/domain'
import { DomainBus }                 from '~foundry/domain/domain-bus.js'
import { PolicyViolation }           from '~foundry/exceptions/policy-violation.js'
import { UniqueId }                  from '~foundry/indexing/unique-id.js'
import { left, Result, right }       from '~foundry/technical/result.js'
import { Account }                   from '../../domain/entities/account'
import { AccountCreated }            from '../../domain/events/account-created/account-created.js'
import { Identity }                  from '../../domain/identity'
import { hashPassword }              from '../../domain/value-objects/password.js'
import { IdentityAndAccessQueryBus } from '../bus/identity-and-access-query-bus.js'
import { CreateAccount }             from '../commands/create-account/create-account'
import { FindAccountByUsername }     from '../queries/get-account-by-username/find-account-by-username'



export class CreateAccountUsecase
	extends UseCase<CreateAccount, UniqueId, PolicyViolation> {
	constructor(
		private readonly queryBus : IdentityAndAccessQueryBus,
		private readonly eventBus : DomainBus<AccountCreated | DomainEvent<Account>>,
	) {
		super()
	}
	
	public async execute(command : CreateAccount) : Promise<Result<PolicyViolation, UniqueId>> {
		const getAccountByUsernameQuery = new FindAccountByUsername( command.username )
		const fetchExistingAccount = await this.queryBus.handle<FindAccountByUsername>( getAccountByUsernameQuery )
		
		if(fetchExistingAccount) {
			return left( new PolicyViolation( 409, 'CreateAccountWhenAccountWasNotCreatedBefore' ) )
		}
		
		const passwordHash = await hashPassword( command.password )
		
		const account = new Account( {
			password: passwordHash, username: command.username,
		} )
		
		const identity = new Identity( account )
		
		identity.create()
		
		// TODO: This was actually only for experimental purposes.
		for await (const event of identity.events) {
			await this.eventBus.handle( event )
		}
		
		let fetchAccount = await this.queryBus.handle<FindAccountByUsername>( getAccountByUsernameQuery )
		
		if(!fetchAccount) {
			return left( new PolicyViolation( 403, 'CreateAccountWhenAccountWasNotCreatedBefore' ) )
		}
		
		return right( fetchAccount._id! )
	}
}
