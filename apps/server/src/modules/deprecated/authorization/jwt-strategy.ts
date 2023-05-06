import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { Service } from 'diod'
import { JWT_SECRET } from '../../../shared/configuration/environment-variables.js'
import { prisma } from '../../../shared/infrastructure/prisma/prisma.js'

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET
	// issuer: 'account.neuronek.xyz',
	// audience: 'neuronek.xyz'
}

@Service()
export class JwtStrategy extends Strategy {
	constructor() {
		super(options, async (payload, done) => {
			const user = await prisma.account.findUnique(payload.sub)

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
