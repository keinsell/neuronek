import { IamEventBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.event-bus'
import { IamQueryBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.query-bus'
import { CreateAccount as CreateAccountCommand } from '../../../../modules/identity-and-access-mangement/application/commands/create-account/create-account'
import { CreateAccountUsecase } from '../../../../modules/identity-and-access-mangement/application/usecases/create-account-usecase'
import { createPassword } from '../../../../modules/identity-and-access-mangement/domain/value-objects/password.js'
import { createUsername } from '../../../../modules/identity-and-access-mangement/domain/value-objects/username/username.js'
import { Exception } from '../../../../shared/core/domain/exception.js'
import { Body, Controller, OperationId, Post, Response, Route, SuccessResponse, Tags } from 'tsoa'

/**
 * Represents the request body for creating an account.
 * @example { "username": "john_doe", "password": "my-password" }
 */
interface CreateAccount {
	/** The username for the account. */
	username: string
	/** The password for the account. */
	password: string
}

@Route('account')
@Tags('Account')
export class CreateAccountController extends Controller {
	/**
	 * Creates an account.
	 */
	@Post()
	@OperationId('create-account')
	@SuccessResponse('201', 'Created')
	@Response(403, 'AlreadyExists')
	public async createAccount(@Body() body: CreateAccount): Promise<{ id: string } | { error: string }> {
		try {
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
		} catch (error: unknown) {
			if (error instanceof Exception) {
				this.setStatus(error.statusCode)
				return { error: error.message }
			}

			this.setStatus(500)
			return { error: 'Failed to create account' }
		}
	}
}
