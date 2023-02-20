import { PrismaService, prisma } from '../../shared/infrastructure/prisma/prisma.js'
import { validatePublicPgpKey } from '../authorization/authorization-challange.js'

export async function registerAccount(username: string, publickey: string) {
	// Check if account with provided username exists
	const user = await prisma.account.findUnique({ where: { username } })

	// If user exists, throw an error
	if (user) {
		// throw new Error('User with username already exists')
		throw new Error('User with username already exists')
	}

	// Validate provided public-key
	if (!validatePublicPgpKey(publickey)) {
		throw new Error('Provided public-key is invalid')
	}

	// If user doesn't exist, create new account
	const account = await prisma.account.create({
		data: {
			username,
			publicKey: publickey
		}
	})

	return account
}
