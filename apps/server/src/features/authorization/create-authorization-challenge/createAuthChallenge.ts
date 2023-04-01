import { App } from '@tinyhttp/app'
import * as openpgp from 'openpgp'
import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'
import { Request, Response } from '@tinyhttp/app'

const prisma = new PrismaClient()
const app = new App()

function generateAuthCode(): string {
	const randomBytesLength = 32 // 32 bytes = 256 bits
	const buffer = randomBytes(randomBytesLength)
	return buffer.toString('hex')
}

interface AuthorizationChallange {
	id: string
	challenge: string
}

export const createAuthChallenge = async (username: string): Promise<AuthorizationChallange> => {
	const challenge = generateAuthCode()
	const validUntil = new Date()
	validUntil.setMinutes(validUntil.getMinutes() + 10) // Challenge is valid for 10 minutes

	// Get user's public key
	const user = await prisma.account.findUnique({
		where: {
			username
		}
	})

	if (!user) {
		throw new Error(`Unable to find user with username ${username}`)
	}

	const message = await openpgp.createMessage({
		text: challenge
	})

	const publicKey = await openpgp.readKey({
		armoredKey: user.publicKey
	})

	const encryptedMessage = await openpgp.encrypt({
		message,
		encryptionKeys: [publicKey]
	})

	const authChallenge = await prisma.authenticationChallange.create({
		data: {
			challenge: encryptedMessage,
			valid_until: validUntil.toISOString()
		}
	})

	return {
		id: authChallenge.id,
		challenge: encryptedMessage
	}
}

export const defineNewAuthChallenge = async (req: Request, res: Response): Promise<void> => {
	const { username } = req.params

	if (!username) {
		res.status(400).json({ error: 'Missing pubkey in request body' })
		return
	}

	try {
		const authChallange = await createAuthChallenge(username)
		res.json(authChallange)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to create authentication challenge' })
	}
}