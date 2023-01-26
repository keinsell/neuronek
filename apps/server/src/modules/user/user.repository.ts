import { Service } from 'diod'
import { PrismaCreateUserRecord, PrismaService, PrismaUserRecord } from '../../shared/infrastructure/prisma/prisma.js'
import { User } from './user.entity.js'
import { Password } from './password/password.vo.js'

export abstract class UserRepository {
	abstract save(user: User): Promise<User>
	abstract findByUsername(username: string): Promise<User | undefined>
}

@Service()
export class InMemoryUserRepository implements UserRepository {
	user: User

	async save(user: User): Promise<User> {
		this.user = user
		return this.user
	}

	async findByUsername(username: string): Promise<User> {
		throw new Error('Method not implemented.')
	}
}

@Service()
export class PrismaUserRepository implements UserRepository {
	constructor(private prisma: PrismaService) {}

	private User__PrismaCreateUserRecord(data: User): PrismaCreateUserRecord {
		return {
			username: data.username,
			password: data.password.value
		}
	}

	private async PrismaUserRecord__User(data: PrismaUserRecord): Promise<User> {
		return new User(
			{
				username: data.username,
				password: await Password.fromString(data.password)
			},
			data.id
		)
	}

	async save(user: User): Promise<User> {
		const data = this.User__PrismaCreateUserRecord(user)
		const result = await this.prisma.user.create({ data })
		return await this.PrismaUserRecord__User(result)
	}

	async findByUsername(username: string): Promise<User> {
		const result = await this.prisma.user.findUnique({ where: { username } })

		if (!result) {
			return undefined
		}
		return this.PrismaUserRecord__User(result)
	}
}
