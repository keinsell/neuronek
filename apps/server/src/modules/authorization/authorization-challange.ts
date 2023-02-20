import { Account } from '@prisma/client'
import { nanoid } from 'nanoid'
import { randomBytes } from 'node:crypto'
import { Key, readKey, encrypt, createMessage } from 'openpgp'
import { keyv } from '../../infrastructure/keyv.infra.js'
import { prisma } from '../../shared/infrastructure/prisma/prisma.js'
import { JwtToken } from './jwt-token.js'

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

// https://keybase.io/kbpgp
// https://github.com/openpgpjs/openpgpjs
export async function defineAuthorizationChallangeForAccount(account: Account) {
	const strings = account.publicKey.split('\n')
	const joinnedStrings = strings.join('\n')

	const publicKey = await readKey({
		armoredKey: joinnedStrings
	})

	// 1. Generate random message
	const secretMessage = randomBytes(32).toString('hex')

	// 2. Encrypt with public-key
	const message = await encrypt({
		message: await createMessage({ text: secretMessage }),
		encryptionKeys: publicKey.toPublic()
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
