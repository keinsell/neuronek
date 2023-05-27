import { JsonWebToken } from '../domain/value-objects/json-web-token.js'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { UniqueId } from '~foundry/indexing/unique-id.js'

const generateTokens = (
	accountId: UniqueId,
	payload?: unknown
): {
	refreshToken: string
	accessToken: string
} => {
	const jti = nanoid(128)

	const options: jwt.SignOptions = {
		issuer: 'neuronek.xyz',
		audience: 'account.neuronek.xyz',
		jwtid: jti,
		subject: accountId.toString()
	}

	const refreshToken: string = jwt.sign(payload || {}, 'secretKey', { ...options, expiresIn: '7d' })
	const accessToken: string = jwt.sign(payload || {}, 'secretKey', { ...options, expiresIn: '2h' })

	return {
		refreshToken,
		accessToken
	}
}

const verifyToken = (token: string): JsonWebToken => {
	try {
		const decodedToken = jwt.verify(token, 'secretKey', {
			issuer: 'neuronek.xyz',
			audience: 'account.neuronek.xyz'
		}) as JsonWebToken

		// Validate the token with io-ts
		const result = JsonWebToken.decode(decodedToken)

		if (result._tag !== 'Right') {
			throw new Error('Invalid Token')
		}

		return result.right
	} catch (error) {
		throw new Error('Invalid Token')
	}
}

export { generateTokens, verifyToken }
