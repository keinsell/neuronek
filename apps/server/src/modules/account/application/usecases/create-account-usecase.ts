import { UniqueId } from '../../../../shared/core/indexing/unique-id'
import { Usecase } from '../../../../shared/core/usecase'
import { Account } from '../../domain/entities/account'
import { CreateAccount } from '../commands/create-account/create-account'

export class CreateAccountUsecase extends Usecase<CreateAccount, UniqueId, any> {
	public async execute(command: CreateAccount): Promise<UniqueId> {
		console.log('CreateAccountUsecase', command)

		const account = new Account({
			publicKey: command.publicKey,
			username: command.username
		})

		console.log('account', account)

		return ''
	}
}
