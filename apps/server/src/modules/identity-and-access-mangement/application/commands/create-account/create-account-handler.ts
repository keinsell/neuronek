import { Command } from '../../../../../shared/core/cqrs/command/command'
import { CommandHandler } from '../../../../../shared/core/cqrs/command/command-handler'
import { CreateAccount } from './create-account'

export class CreateAccountHandler extends CommandHandler<CreateAccount> {
	public async handle(command: Command): Promise<void> {
		console.log('CreateAccountHandler', command)
	}
}
