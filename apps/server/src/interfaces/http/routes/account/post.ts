import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { CreateAccount } from '../../../../modules/identity-and-access-mangement/application/commands/create-account/create-account'
import { CreateAccountUsecase } from '../../../../modules/identity-and-access-mangement/application/usecases/create-account-usecase'
import { PrettyGoodPrivacy } from '../../../../shared/common/pretty-good-privacy'

const prisma = new PrismaClient()

interface AccountData {
	username: string
	publicKey: string
}

export async function createAccount(req: Request, res: Response) {
	try {
		const { username, publicKey } = req.body as AccountData

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

		const command = new CreateAccount({ username, publicKey })
		const usecase = new CreateAccountUsecase()

		const usecaseResult = await usecase.execute(command)

		const userIdentity = usecaseResult.unwrapOr(null)

		if (!userIdentity) {
			return res.status(500).json({ error: 'Failed to create account' })
		}

		await prisma.account.create({
			data: {
				username,
				publicKey
			}
		})

		return res.status(201).json({ id: userIdentity })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'Failed to create account' })
	}
}
