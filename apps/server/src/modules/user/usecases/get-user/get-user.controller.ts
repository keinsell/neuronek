import {
	Body,
	Controller,
	Example,
	Get,
	Header,
	Middlewares,
	OperationId,
	Post,
	Request,
	Response,
	Route,
	Security,
	SuccessResponse,
	Tags
} from 'tsoa'
import { UserResponse } from '../../user.response.js'
import { UsernameTakenError } from '../../errors/username-taken.error.js'
import { Service } from 'diod'
import { GetUserService } from './get-user.service.js'
import passport from 'passport'
import { User } from '../../user.entity.js'

@Service()
@Route('user')
@Tags('user')
export class GetUserController extends Controller {
	constructor(private service: GetUserService) {
		super()
	}

	/**
	 * Get information about user profile and refresh tokens.
	 * @summary Get user
	 */
	@Get()
	@OperationId('get-user')
	@SuccessResponse('200', 'User')
	@Example<UserResponse>({
		id: 'cldctwu260000pm4a9b83zgvs',
		username: 'keinsell',
		jwt_token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ3MjE0NTEsImV4cCI6MTY3NDcyODY1MSwiYXVkIjoiYWNjb3VudC5uZXVyb25lay54eXoiLCJpc3MiOiJuZXVyb25lay54eXoiLCJzdWIiOiJjbGRjdHd1MjYwMDAwcG00YTliODN6Z3ZzIiwianRpIjoiMzE2OCJ9.R3wF4_lUIOYFB9uVz5CQ36sZeIESJfEjQuBDQ7To8sI',
		refresh_token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ3MjE0NTEsImV4cCI6MTY3NTkzMTA1MSwiYXVkIjoiYWNjb3VudC5uZXVyb25lay54eXoiLCJpc3MiOiJuZXVyb25lay54eXoiLCJzdWIiOiJjbGRjdHd1MjYwMDAwcG00YTliODN6Z3ZzIiwianRpIjoiMzE2OCJ9.p_g0drCiRBl9ADAidVZ7vnq2Gv21MjVaqo-k0u3ldfE'
	})
	@Response<UsernameTakenError>('400', 'Username already taken', {
		message: 'This username is already taken.',
		statusCode: 400
	})
	@Middlewares([passport.authenticate('jwt', { session: false })])
	@Security('Bearer')
	async registerUser(@Request() req: Express.Request & { user: User }): Promise<UserResponse> {
		const response = await this.service.execute(req.user.id)

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
