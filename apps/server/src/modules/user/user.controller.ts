import { Service } from 'diod'
import { Body, Get, OperationId, Post, Query, Route, Tags } from 'tsoa'
import { registerAccount } from './user.service.js'
import {
	defineAuthorizationChallangeForAccount,
	solveAuthorizationChallange
} from '../authorization/authorization-challange.js'
import { prisma } from '../../shared/infrastructure/prisma/prisma.js'

@Service()
@Route('user')
@Tags('user')
export class UserController {
	@Post()
	@OperationId('user-register')
	async registerUser(@Body() body: { public_key: string; username: string }) {
		const account = await registerAccount(body.username, body.public_key)
		const challange = await defineAuthorizationChallangeForAccount(account)
		return challange
	}

	@Get('authorization-challange/{username}')
	@OperationId('user-get-authorization-challange')
	async getUserAuthorizationChallange(username: string) {
		// Find account by username
		const account = await prisma.account.findUnique({
			where: { username }
		})

		if (!account) {
			return null
		}

		// Define authorization challange for account
		const challange = await defineAuthorizationChallangeForAccount(account)

		return challange
	}

	@Post('authorization-challange/{challangeId}')
	@OperationId('user-solve-authorization-challange')
	async solveChallange(challangeId: string, @Query('message') message: string) {
		// Find and solve authorization challange
		const solution = await solveAuthorizationChallange(challangeId, message)

		if (!solution) {
			return null
		}

		// Fetch account object from authorization challange
		return {
			id: solution.subject,
			...solution.toJwtTokenAndRefreshToken()
		}
	}
}
