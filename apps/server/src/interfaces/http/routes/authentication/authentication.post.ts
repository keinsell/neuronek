import { IamQueryBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.query-bus'
import { Authenticate } from '../../../../modules/identity-and-access-mangement/application/commands/authenticate/authenticate.js'
import {
	AuthenticateResponse,
	AuthenticateUsecase
} from '../../../../modules/identity-and-access-mangement/application/usecases/authenticate-usecase.js'
import { createPassword } from '../../../../modules/identity-and-access-mangement/domain/value-objects/password.js'
import { createUsername } from '../../../../modules/identity-and-access-mangement/domain/value-objects/username/username.js'
import { Body, Controller, OperationId, Post, Route, Tags } from 'tsoa'
import { Exception } from '~foundry/exceptions/exception.js'

/**
 * Represents the request body for creating an account.
 * @example { "username": "john_doe", "password": "my-password" }
 */
interface AuthenticateAccount {
	/** The username for the account. */
	username: string
	/** The password for the account. */
	password: string
}

@Route('authentication')
@Tags('Account')
export class AuthenticateController extends Controller {
	/**
	 * Creates an account.
	 */
	@Post()
	@OperationId('authenticate-account')
	public async createAccount(@Body() body: AuthenticateAccount): Promise<AuthenticateResponse | { error: string }> {
		try {
			const command = new Authenticate({
				username: await createUsername(body.username),
				password: await createPassword(body.password)
			})

			const usecase = new AuthenticateUsecase(new IamQueryBus())

			const result = await usecase.execute(command)

			if (result._tag === 'Right') {
				this.setStatus(201)
				return result.right
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
