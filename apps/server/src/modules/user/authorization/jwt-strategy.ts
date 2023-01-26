import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { UserRepository } from '../user.repository.js'
import { Service } from 'diod'

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'adsads',
	issuer: 'account.neuronek.xyz',
	audience: 'neuronek.xyz'
}

@Service()
export class JwtStrategy extends Strategy {
	constructor(private userRepository: UserRepository) {
		super(options, async (payload, done) => {
			const user = await this.userRepository.findByUsername(payload.sub)

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
