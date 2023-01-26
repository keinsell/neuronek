import { User } from '../user.entity.js'
import jsonwebtoken from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { JWT_SECRET } from '../../../shared/configuration/environment-variables.js'

export class JwtToken {
	/**
	 * Stands for "subject" and it's a string that typically contains the user's unique identifier.
	 */
	protected readonly subject: string
	/**
	 * Stands for "JWT ID" and it's a string that contains a unique ID to identify the JWT.
	 */
	protected readonly jti: string = nanoid(128)

	protected readonly issuer: string = 'neuronek.xyz'
	protected readonly audience: string = 'account.neuronek.xyz'

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

	static fromUser(user: User): JwtToken {
		const token = new JwtToken({
			userId: user.id
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

	static fromJsonWebToken(token: string): JwtToken {
		// Decode JWT token
		const decoded = jsonwebtoken.decode(token, { json: true }) as {
			iss?: string
			aud: string
			jti: string
			sub: string
			iat: number
			exp: number
		}

		// Verify token
		const verify = jsonwebtoken.verify(token, JWT_SECRET)

		const token_class = new JwtToken({
			userId: decoded.sub
		})

		return token_class
	}
}
