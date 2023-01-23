import { PrismaClient } from 'database'
import { Service } from 'diod'

@Service()
export class PrismaService extends PrismaClient {
	constructor() {
		super()
		this.$connect()
	}
}
