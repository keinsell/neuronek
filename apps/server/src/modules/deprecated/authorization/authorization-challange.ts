import { Account } from '@prisma/client'
import { nanoid } from 'nanoid'
import { randomBytes } from 'node:crypto'
import { Key, readKey, encrypt, createMessage } from 'openpgp'
import { keyv } from '../../../shared/infrastructure/keyv.infra.js'
import { prisma } from '../../../shared/infrastructure/prisma/prisma.js'
import { JwtToken } from '../../authorization/jwt-token.js'

export namespace AuthorizationChallange {
	export interface AuthorizationChallange {
		challangeId: string
		message: string
	}

	export async function defineForAccount(account: Account): Promise<AuthorizationChallange> {
		const publickey = await readPublicKey(account.publicKey)
		const secret = await generateSecretMessage()
		const encryptedMessage = await encryptMessage(secret, publickey)
		const challangeId = nanoid(8)

		await keyv.set(
			`authorization:challange:${challangeId}`,
			{
				accountId: account.id,
				message: secret
			},
			36000
		)

		return {
			challangeId,
			message: encryptedMessage
		}
	}

	export async function solve(challangeId: string, message: string) {
		// 1. Find challange in the key-value storage
		const challange = (await keyv.get(`authorization:challange:${challangeId}`)) as {
			accountId: string
			message: string
		}

		// 2. If challange does not exist, return false
		if (!challange) return null

		if (challange.message !== message) return null

		// 4. If message and secret message are the same, find account
		const account = await prisma.account.findUnique({ where: { id: challange.accountId } })

		// 5. If account does not exist, return false
		if (!account) return null

		// 6. If account exists, return account and delete challange
		await keyv.delete(`authorization:challange:${challangeId}`)

		// 7. Prepare jwt tokens
		return JwtToken.byAccount(account)
	}

	export async function generateSecretMessage() {
		return randomBytes(32).toString('hex')
	}

	export async function readPublicKey(publicKey: string) {
		const strings = publicKey.split('\n')
		const joinnedStrings = strings.join('\n')

		return await readKey({
			armoredKey: joinnedStrings
		})
	}

	export async function encryptMessage(message: string, to: Key) {
		return await encrypt({
			message: await createMessage({ text: message }),
			encryptionKeys: to.toPublic()
		})
	}
}

export async function validatePublicPgpKey(publicKey: string) {
	const strings = publicKey.split('\n')
	const joinnedStrings = strings.join('\n')

	let parsedKey: Key | undefined = undefined

	try {
		parsedKey = await readKey({ armoredKey: joinnedStrings })
	} catch (error) {
		return false
	}

	if (!parsedKey || parsedKey.isPrivate()) {
		return false
	}

	return true
}
