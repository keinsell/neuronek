import { Service } from 'diod'
import { Password } from '../password/password.vo.js'
import { User } from '../user.entity.js'
import { UserRepository } from '../user.repository.js'
import { RegisterUserRequest } from './register-user.request.js'
import { Usecase } from '../../../shared/common/domain/usecase.js'
import { UsernameTakenError } from '../errors/username-taken.error.js'
import { Result, err, ok } from 'neverthrow'

@Service()
export class RegisterUserService implements Usecase<RegisterUserRequest, User, UsernameTakenError> {
	constructor(private userRepository: UserRepository) {}

	async execute(request: RegisterUserRequest): Promise<Result<User, UsernameTakenError>> {
		const alreadyExists = await this.userRepository.findByUsername(request.username)

		if (alreadyExists) {
			return err(new UsernameTakenError())
		}

		let user = new User({
			username: request.username,
			password: new Password(request.password)
		})

		user = await this.userRepository.save(user)

		return ok(user)
	}
}
