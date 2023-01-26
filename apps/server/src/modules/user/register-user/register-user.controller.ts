import { Body, Controller, Example, Middlewares, OperationId, Post, Response, Route, SuccessResponse, Tags } from 'tsoa'
import { UserResponse } from '../user.response.js'
import type { RegisterUserRequest } from './register-user.request.js'
import { Service } from 'diod'
import { RegisterUserService } from './register-user.service.js'
import { nanoid } from 'nanoid'
import { UsernameTakenError } from '../errors/username-taken.error.js'

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
	@SuccessResponse('201', 'User registered')
	@Example<UserResponse>({
		id: 'abc123',
		username: 'user1',
		jwt_token: 'ad'
	})
	@Response<UsernameTakenError>('400', 'Username already taken', {
		message: 'This username is already taken.',
		statusCode: 400
	})
	async registerUser(@Body() body: RegisterUserRequest): Promise<UserResponse> {
		const response = await this.registerUserService.execute(body)

		// Handle Error
		if (response.isErr()) {
			this.setStatus(response.error.statusCode || 400)
			return response.error as any
		}

		const { access_token, refresh_token } = response.value.token.toJwtTokenAndRefreshToken()

		// Response
		this.setStatus(201)
		return {
			id: response.value.id,
			username: response.value.username,
			jwt_token: access_token,
			refresh_token: refresh_token
		}
	}
}
