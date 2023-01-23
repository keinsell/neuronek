import { Service } from 'diod'
import { PrismaService } from '../../infrastructure/prisma/prisma.js'

@Service()
export class UserRepository {
	constructor(private prismaService: PrismaService) {}

	async findUserById(userId: string) {
		return this.prismaService.user.findUnique({
			where: { id: userId }
		})
	}
}
