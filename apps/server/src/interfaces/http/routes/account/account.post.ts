import { IamEventBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.event-bus'
import { IamQueryBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.query-bus'
import { CreateAccount as CreateAccountCommand } from '../../../../modules/identity-and-access-mangement/application/commands/create-account/create-account'
import { CreateAccountUsecase } from '../../../../modules/identity-and-access-mangement/application/usecases/create-account-usecase'
import { createPassword } from '../../../../modules/identity-and-access-mangement/domain/value-objects/password.js'
import { createUsername } from '../../../../modules/identity-and-access-mangement/domain/value-objects/username.js'
import { Body, Controller, OperationId, Post, Route } from 'tsoa'

interface CreateAccount {
	username: string
	password: string
}

@Route('account')
export class CreateAccountController extends Controller {
	@Post()
	@OperationId('create-account')
	public async createAccount(@Body() body: CreateAccount): Promise<{ id: string } | { error: string }> {
		const command = new CreateAccountCommand({
			username: await createUsername(body.username),
			password: await createPassword(body.password)
		})

		const usecase = new CreateAccountUsecase(new IamQueryBus(), new IamEventBus())

		const result = await usecase.execute(command)

		if (result._tag === 'Right') {
			this.setStatus(201)
			return { id: result.right as string }
		} else {
			this.setStatus(result.left.statusCode)
			return { error: result.left.message }
		}
	}
	catch(error: any) {
		console.error(error)
		this.setStatus(500)
		return { error: 'Failed to create account' }
	}
}
