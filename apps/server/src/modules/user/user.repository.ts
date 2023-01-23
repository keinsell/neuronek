import { User } from './user.entity.js'

export abstract class UserRepository {
	abstract save(user: User): Promise<User>
}

export class InMemoryUserRepository extends UserRepository {
	user: User

	async save(user: User): Promise<User> {
		this.user = user
		return this.user
	}
}
