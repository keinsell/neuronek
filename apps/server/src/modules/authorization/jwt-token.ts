import jsonwebtoken from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { JWT_SECRET } from '../../shared/configuration/environment-variables.js'
import { Account } from '@prisma/client'

export class JwtToken {
	/**
	 * Stands for "subject" and it's a string that typically contains the user's unique identifier.
	 */
	public readonly subject: string
	/**
	 * Stands for "JWT ID" and it's a string that contains a unique ID to identify the JWT.
	 */
	public readonly jti: string = nanoid(128)

	public readonly issuer: string = 'neuronek.xyz'
	public readonly audience: string = 'account.neuronek.xyz'

	protected readonly access_token: jsonwebtoken.SignOptions
	protected readonly refresh_token: jsonwebtoken.SignOptions

	constructor(payload: { userId: string }) {
		this.subject = payload.userId

		this.access_token = {
			expiresIn: '2h',
			issuer: this.issuer,
			audience: this.audience,
			jwtid: this.jti,
			subject: this.subject
		}

		this.refresh_token = {
			expiresIn: '14d',
			issuer: this.issuer,
			audience: this.audience,
			jwtid: this.jti,
			subject: this.subject
		}
	}

	static byAccount(account: Account): JwtToken {
		const token = new JwtToken({
			userId: account.id
		})
		return token
	}

	private getRawTokenContent(): any {
		return {}
	}

	public toJwtTokenAndRefreshToken(): {
		access_token: string
		refresh_token: string
	} {
		const access_token = jsonwebtoken.sign(this.getRawTokenContent(), JWT_SECRET, this.access_token)
		const refresh_token = jsonwebtoken.sign(this.getRawTokenContent(), JWT_SECRET, this.refresh_token)

		return {
			access_token,
			refresh_token
		}
	}

	static fromAuthHeader(token: string): JwtToken | undefined {
		try {
			const { sub } = jsonwebtoken.verify(token, JWT_SECRET) as { sub: string }
			return new JwtToken({
				userId: sub
			})
		} catch (error) {
			return undefined
		}
	}
}
