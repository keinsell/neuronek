import { CreateAccount } from './create-account'
import { Command, CommandHandler } from '~foundry/cqrs'

export class CreateAccountHandler extends CommandHandler<CreateAccount> {
	public async handle(command: Command): Promise<void> {
		console.log('CreateAccountHandler', command)
	}
}
