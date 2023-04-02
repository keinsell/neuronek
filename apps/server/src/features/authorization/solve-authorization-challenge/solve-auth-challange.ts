import { PrismaClient } from 'database'
import { Request, Response } from '@tinyhttp/app'
import * as openpgp from 'openpgp'

const prisma = new PrismaClient()

export const solveAuthChallenge = async (req: Request, res: Response): Promise<void> => {
	const { authChallengeId, message } = req.body

	if (!authChallengeId || !message) {
		res.status(400).json({ error: 'Missing authChallengeId or response in request body' })
		return
	}

	const authChallenge = await prisma.authenticationChallange.findUnique({ where: { id: authChallengeId } })

	if (!authChallenge) {
		res.status(400).json({ error: 'Invalid authChallengeId' })
		return
	}

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

	const now = new Date()
	if (now > new Date(authChallenge.valid_until)) {
		await prisma.authenticationChallange.update({
			where: { id: authChallengeId },
			data: { success: false }
		})
		res.status(401).json({ error: 'Challenge expired' })
		return
	}

	await prisma.authenticationChallange.update({
		where: { id: authChallengeId },
		data: { success: true, response: message }
	})

	res.json({ message: 'Authentication successful' })
}
