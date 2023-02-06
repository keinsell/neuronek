import { Body, Controller, Example, Middlewares, OperationId, Post, Response, Route, SuccessResponse, Tags } from 'tsoa'
import { UserResponse } from '../../user.response.js'
import { Service } from 'diod'
import type { LoginUserRequest } from './login-user.request.js'
import { LoginUserService } from './login-user.service.js'
import { UserNotFoundError } from '../../errors/user-not-found.error.js'

@Service()
@Route('user')
@Tags('user')
export class LoginUserController extends Controller {
	constructor(private loginUserService: LoginUserService) {
		super()
	}

	/**
	 * Login a user.
	 * @summary Log in a user.
	 */
	@Post('/authenticate')
	@OperationId('login-user')
	@SuccessResponse('200', 'User logged in')
	@Example<UserResponse>({
		id: 'cldctwu260000pm4a9b83zgvs',
		username: 'keinsell',
		jwt_token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ3MjE0NTEsImV4cCI6MTY3NDcyODY1MSwiYXVkIjoiYWNjb3VudC5uZXVyb25lay54eXoiLCJpc3MiOiJuZXVyb25lay54eXoiLCJzdWIiOiJjbGRjdHd1MjYwMDAwcG00YTliODN6Z3ZzIiwianRpIjoiMzE2OCJ9.R3wF4_lUIOYFB9uVz5CQ36sZeIESJfEjQuBDQ7To8sI',
		refresh_token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ3MjE0NTEsImV4cCI6MTY3NTkzMTA1MSwiYXVkIjoiYWNjb3VudC5uZXVyb25lay54eXoiLCJpc3MiOiJuZXVyb25lay54eXoiLCJzdWIiOiJjbGRjdHd1MjYwMDAwcG00YTliODN6Z3ZzIiwianRpIjoiMzE2OCJ9.p_g0drCiRBl9ADAidVZ7vnq2Gv21MjVaqo-k0u3ldfE'
	})
	@Response<UserNotFoundError>('404', 'User not found', {
		message: '...',
		statusCode: 404
	})
	async loginUser(@Body() body: LoginUserRequest): Promise<UserResponse> {
		const response = await this.loginUserService.execute(body)

		// Handle Error
		if (response.isErr()) {
			this.setStatus(response.error.statusCode || 400)
			return response.error as any
		}

		const { access_token, refresh_token } = response.value.token.toJwtTokenAndRefreshToken()

		// Response
		this.setStatus(200)
		return {
			id: response.value.id,
			username: response.value.username,
			jwt_token: access_token,
			refresh_token: refresh_token
		}
	}
}
