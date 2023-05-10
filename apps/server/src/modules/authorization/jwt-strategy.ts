import { PrismaClient } from '@prisma/client'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'

const prisma = new PrismaClient()

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env['JWT_SECRET'] || 'default_secret'
}

export class JwtStrategy extends Strategy {
	constructor() {
		super(options, async (payload, done) => {
			const user = await prisma.account.findUnique({ where: { id: payload.sub } })

			if (!user) {
				return done(null, false)
			}

			if (user) {
				return done(null, user)
			}

			return done(null, false)
		})
	}
}
