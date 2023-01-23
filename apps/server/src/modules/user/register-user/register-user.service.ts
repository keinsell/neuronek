import { Service } from 'diod'
import { Password } from '../password/password.vo.js'
import { User } from '../user.entity.js'
import { UserRepository } from '../user.repository.js'
import { RegisterUserRequest } from './register-user.request.js'

@Service()
export class RegisterUserService {
	constructor(private userRepository: UserRepository) {}

	async execute(data: RegisterUserRequest): Promise<User> {
		const user = new User({
			username: data.username,
			password: new Password(data.password)
		})

		const alreadyExists = await this.userRepository.findByUsername(user.username)

		if (alreadyExists) {
			throw new Error('User already registered')
		}

		const saved = await this.userRepository.save(user)

		return saved
	}
}
