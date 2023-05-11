import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { CreateAccount } from '../../../../modules/account/application/commands/create-account/create-account'
import { AccountCommandBus } from '../../../../modules/account/infrastructure/account.command-bus'
import { PrettyGoodPrivacy } from '../../../../shared/common/pretty-good-privacy'

const prisma = new PrismaClient()

interface AccountData {
	username: string
	publicKey: string
}

export async function createAccount(req: Request, res: Response) {
	try {
		const { username, publicKey } = req.body as AccountData

		const command = new CreateAccount({ username, publicKey })
		await new AccountCommandBus().send(command)

		// Validate username and public key
		const errors = []
		if (!username) {
			errors.push('Username is required')
		}
		if (!publicKey) {
			errors.push('Public key is required')
		} else if (!(await PrettyGoodPrivacy.validatePublicKey(publicKey))) {
			errors.push('Invalid public key')
		}

		// Check if username is already taken
		const existingAccount = await prisma.account.findUnique({
			where: { username }
		})
		if (existingAccount) {
			errors.push('Username already taken')
		}

		if (errors.length) {
			return res.status(400).json({ errors })
		}

		// Create new account in the database
		const account = await prisma.account.create({
			data: {
				username,
				publicKey
			}
		})

		return res.status(201).json({ account })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'Failed to create account' })
	}
}
