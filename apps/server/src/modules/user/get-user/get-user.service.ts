import { Service } from 'diod'
import { Usecase } from '../../../shared/common/domain/usecase.js'
import { UserNotFoundError } from '../errors/user-not-found.error.js'
import { UserRepository } from '../user.repository.js'
import { Result, err, ok } from 'neverthrow'
import { User } from '../user.entity.js'
import { JwtToken } from '../../authorization/jwt-token.js'

@Service()
export class GetUserService implements Usecase<string, User & { token: JwtToken }, UserNotFoundError> {
	constructor(private userRepository: UserRepository) {}

	async execute(request: string): Promise<Result<User & { token: JwtToken }, UserNotFoundError>> {
		const user = await this.userRepository.findByUserId(request)

		if (!user) {
			return err(new UserNotFoundError())
		}

		const token = JwtToken.fromUser(user)

		return ok({ ...user, token })
	}
}
