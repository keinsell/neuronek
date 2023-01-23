import { Body, Controller, Example, OperationId, Post, Route, Tags } from 'tsoa'
import { User } from '../user.entity.js'
import { UserResponse } from '../user.response.js'
import type { RegisterUserRequest } from './register-user.request.js'
import { Password } from '../password/password.vo.js'
import { Service } from 'diod'
import { RegisterUserService } from './register-user.service.js'
import { nanoid } from 'nanoid'

@Service()
@Route('user')
@Tags('user')
export class RegisterUserController extends Controller {
	constructor(private registerUserService: RegisterUserService) {
		super()
	}

	/**
	 * Register a new user.
	 * @summary Register a new user
	 */
	@Post()
	@OperationId('register-user')
	async registerUser(@Body() body: RegisterUserRequest): Promise<UserResponse> {
		// TODO: Validate Body

		const response = await this.registerUserService.execute(body)

		return {
			id: response.id,
			username: response.username,
			jwt_token: 'ads'
		}
	}
}
