import { Request, Response } from '@tinyhttp/app'
import * as openpgp from 'openpgp'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function validatePublicKey(publicKey: string) {
	try {
		// Parse the PGP public key
		const key = await openpgp.readKey({
			armoredKey: publicKey.trim()
		})

		return true
	} catch (error) {
		console.error('Error validating PGP public key:', error)
		return false
	}
}

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
		} else if (!validatePublicKey(publicKey)) {
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
