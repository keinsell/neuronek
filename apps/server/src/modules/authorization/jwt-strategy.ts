import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { UserRepository } from '../user/user.repository.js'
import { Service } from 'diod'
import { JWT_SECRET } from '../../shared/configuration/environment-variables.js'

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET
	// issuer: 'account.neuronek.xyz',
	// audience: 'neuronek.xyz'
}

@Service()
export class JwtStrategy extends Strategy {
	constructor(private userRepository: UserRepository) {
		super(options, async (payload, done) => {
			console.log(payload)

			const user = await this.userRepository.findByUserId(payload.sub)

			console.log(user)

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
