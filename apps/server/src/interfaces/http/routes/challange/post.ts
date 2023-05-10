import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import * as openpgp from 'openpgp'
import { generateTokens } from '../../../../modules/authorization/services/jwt'

const prisma = new PrismaClient()

export const solveAuthChallenge = async (req: Request, res: Response): Promise<void> => {
	const { authChallengeId, message } = req.body
	if (!authChallengeId || !message) {
		res.status(400).json({ error: 'Missing authChallengeId or response in request body' })
		return
	}

	// First, we check if the given challenge id is valid
	const authChallenge = await prisma.authenticationChallange.findUnique({
		where: { id: authChallengeId }
	})
	if (!authChallenge) {
		res.status(400).json({ error: 'Invalid authChallengeId' })
		return
	}

	// Then, we check if the given response is valid
	const privateKey = await openpgp.readKey({ armoredKey: authChallenge.privateKey })
	const { data: decryptedChallenge } = await openpgp.decrypt({
		message: await openpgp.readMessage({ armoredMessage: authChallenge.challenge }),
		decryptionKeys: [privateKey as openpgp.PrivateKey]
	})

	if (decryptedChallenge !== message) {
		await prisma.authenticationChallange.update({
			where: { id: authChallengeId },
			data: { success: false }
		})
		res.status(401).json({ error: 'Invalid response' })
		return
	}

	// Finally, we check if the challenge has expired
	const now = new Date()
	if (now > new Date(authChallenge.valid_until)) {
		await prisma.authenticationChallange.update({
			where: { id: authChallengeId },
			data: { success: false }
		})
		res.status(401).json({ error: 'Challenge expired' })
		return
	}

	// If all checks passed, we mark the challenge as successful and generate a new JWT
	await prisma.authenticationChallange.update({
		where: { id: authChallengeId },
		data: { success: true, response: message }
	})

	const token = generateTokens(authChallenge.account_id)

	res.json({ accountId: authChallenge.account_id, accessToken: token })
}
