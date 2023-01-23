import { Password } from '../password/password.vo.js'
import { User } from '../user.entity.js'
import { UserRepository } from '../user.repository.js'
import { RegisterUserRequest } from './register-user.request.js'

export class RegisterUserService {
	constructor(private userRepository: UserRepository) {}

	async execute(data: RegisterUserRequest): Promise<User> {
		const user = new User({
			username: data.username,
			password: new Password(data.password)
		})

		const saved = await this.userRepository.save(user)

		return saved
	}
}
