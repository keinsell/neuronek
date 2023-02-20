import { Account } from '@prisma/client'
import { nanoid } from 'nanoid'
import { randomBytes } from 'node:crypto'
import openpgp from 'openpgp'
import { keyv } from '../../infrastructure/keyv.infra.js'
import { prisma } from '../../shared/infrastructure/prisma/prisma.js'
import { JwtToken } from './jwt-token.js'

export async function validatePublicPgpKey(publicKey: string) {
	try {
		const { keys } = await openpgp.key.readArmored(publicKey)

		if (keys.length === 0) {
			return false
		}

		return true
	} catch (error) {
		return false
	}
}

// https://keybase.io/kbpgp
// https://github.com/openpgpjs/openpgpjs
export async function defineAuthorizationChallangeForAccount(account: Account) {
	const publicKey = await openpgp.key.readArmored(account.publicKey)

	// 1. Generate random message
	const secretMessage = randomBytes(32).toString('hex')

	// 2. Encrypt with public-key
	const message = await openpgp.encrypt({
		message: openpgp.message.fromText(secretMessage),
		publicKeys: publicKey.keys
	})

	// 3. Generate unique id for challange
	const uniqueId = nanoid(8)

	// 3. Define authorization challange in key-value storage
	// Key of the authorization looks like this: `authorization:challange:${uniqueId}`
	// TTL for the key is an hour in seconds

	await keyv.set(
		`authorization:challange:${uniqueId}`,
		{
			accountId: account.id,
			message: secretMessage
		},
		3600
	)

	return {
		challangeId: uniqueId,
		message: message
	}
}

export async function solveAuthorizationChallange(challangeId, message: string) {
	// 1. Find challange in the key-value storage
	const challange = (await keyv.get(`authorization:challange:${challangeId}`)) as {
		accountId: string
		message: string
	}

	// 2. If challange does not exist, return false
	if (!challange) return null

	// 3. If challange exists, verify message with secret message from challange
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
