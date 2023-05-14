import jwt from 'jsonwebtoken'
import ms from 'ms'
import { nanoid } from 'nanoid'
import { UniqueId } from '../../../shared/core/indexing/unique-id'
import { AccessToken } from '../domain/value-objects/access-token'
import { RefreshToken } from '../domain/value-objects/refresh-token'

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

const verifyToken = (token: string): RefreshToken | AccessToken => {
	try {
		const decodedToken = jwt.verify(token, 'secretKey', {
			issuer: 'neuronek.xyz',
			audience: 'account.neuronek.xyz'
		}) as RefreshToken | AccessToken

		// Validate the token with io-ts
		const result = decodedToken.exp === ms('2h') ? AccessToken.decode(decodedToken) : RefreshToken.decode(decodedToken)

		if (result._tag !== 'Right') {
			throw new Error('Invalid Token')
		}

		return result.right
	} catch (error) {
		throw new Error('Invalid Token')
	}
}

export { generateTokens, verifyToken }
