import { EventHandler } from '../../../../../shared/core/cqrs/event/event-handler'
import { prisma } from '../../../../../shared/infrastructure/prisma/prisma'
import { AccountCreated } from './account-created'

export class AccountCreatedHandler extends EventHandler<AccountCreated> {
	public async handle(event: AccountCreated): Promise<void> {
		console.log(event)

		await prisma.account.create({
			data: {
				username: event.payload.username,
				publicKey: event.payload.publicKey
			}
		})
	}
}
