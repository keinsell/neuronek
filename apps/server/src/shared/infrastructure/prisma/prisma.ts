import { Prisma } from '@prisma/client'
import { PrismaClient } from 'database'
import { Service } from 'diod'

@Service()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> {
	constructor() {
		super({
			log: [
				{
					emit: 'stdout',
					level: 'query'
				},
				{
					emit: 'stdout',
					level: 'error'
				},
				{
					emit: 'stdout',
					level: 'info'
				},
				{
					emit: 'stdout',
					level: 'warn'
				}
			]
		})
		this.$connect()
	}
}

export const prisma = new PrismaService()
