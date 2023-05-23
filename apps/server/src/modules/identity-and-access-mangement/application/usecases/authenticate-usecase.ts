import { InvalidCredentials } from '../../../../shared/core/domain/exceptions/Invalid-credentials.js'
import { NotFound } from '../../../../shared/core/domain/exceptions/not-found.js'
import { PolicyViolation } from '../../../../shared/core/domain/exceptions/policy-violation.js'
import { left, Result, right } from '../../../../shared/core/technical/result.js'
import { UseCase } from '../../../../shared/core/use-case.js'
import { Account } from '../../domain/entities/account.js'
import { comparePasswordHash } from '../../domain/value-objects/password-hash.js'
import { generateTokens } from '../../services/jwt.js'
import { IamQueryBus } from '../bus/iam.query-bus.js'
import { Authenticate } from '../commands/authenticate/authenticate.js'
import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username.js'

export interface AuthenticateResponse {
	accessToken: string
	refreshToken: string
}

export class AuthenticateUsecase extends UseCase<Authenticate, AuthenticateResponse, PolicyViolation> {
	constructor(private readonly queryBus: IamQueryBus) {
		super()
	}

	public async execute(command: Authenticate): Promise<Result<PolicyViolation, AuthenticateResponse>> {
		const getAccountByUsernameQuery = new FindAccountByUsername(command.username)
		const account = await this.queryBus.handle<Account>(getAccountByUsernameQuery)

		if (!account) {
			return left(new NotFound('Account'))
		}

		const isPasswordSame = await comparePasswordHash(account.password, command.password)

		if (!isPasswordSame) {
			return left(new InvalidCredentials())
		}

		const token = generateTokens(account.id)

		return right({
			accessToken: token.accessToken,
			refreshToken: token.refreshToken
		})
	}
}
