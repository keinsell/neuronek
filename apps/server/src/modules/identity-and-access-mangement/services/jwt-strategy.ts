import { AccessToken } from '../domain/value-objects/access-token.js'
import { RefreshToken } from '../domain/value-objects/refresh-token'
import { PrismaClient } from '@prisma/client'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'

const prisma = new PrismaClient()

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env['JWT_SECRET'] || 'default_secret'
}

export class JwtStrategy extends Strategy {
	constructor() {
		super(options, async (payload: RefreshToken | AccessToken, done) => {
			// Find user in database.
			const user = await prisma.account.findUnique({ where: { id: payload.sub } })

			// TODO: Find session in database and check if it is valid.

			if (user) {
				return done(null, user)
			}

			// TODO: Update last logged in date in Sessions.
			// this.success(user)
			return done(null, false)
		})
	}
}
