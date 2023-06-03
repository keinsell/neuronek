import { CommandHandler }         from '~foundry/cqrs'
import { DomainEvent }            from '~foundry/domain'
import { DomainBus }              from '~foundry/domain/domain-bus.js'
import { Account }                from '../../../domain/entities/account.js'
import { Identity }               from '../../../domain/identity.js'
import { hashPassword }           from '../../../domain/value-objects/password.js'
import { AccountWriteRepository } from '../../../infrastructure/repositories/account.write-repository.js'
import { CreateAccount }          from './create-account'



export class CreateAccountHandler
	extends CommandHandler<CreateAccount> {
	
	constructor(
		private readonly domainBus : DomainBus<DomainEvent<Account>>,
		private accountWriteRepository : AccountWriteRepository,
	) {
		super()
	}
	
	public async handle(command : CreateAccount) : Promise<CreateAccount['_response']> {
		console.log( `${ this.constructor.name } handling ${ command.constructor.name }` )
		
		const passwordHash = await hashPassword( command.password )
		
		const account = new Account( {
			password: passwordHash, username: command.username,
		} )
		
		const identity = new Identity( account )
		
		const saved = await this.accountWriteRepository.save( identity.account )
		
		identity.create()
		
		for await (const event of identity.events) {
			await this.domainBus.dispatch( event )
		}
		
		// TODO: Save events in persistence.
		
		return saved
	}
}
