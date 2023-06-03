import { Command, CommandHandler } from '~foundry/cqrs'
import { CreateAccount }           from './create-account'



export class CreateAccountHandler extends CommandHandler<CreateAccount> {
	public async handle(command: Command): Promise<void> {
		console.log('CreateAccountHandler', command)
	}
}
