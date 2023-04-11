import passport from 'passport'
import { container } from '../../shared/infrastructure/ioc/container.js'
import { JwtStrategy } from '../../deprecated/authorization/jwt-strategy.js'

passport.use(container.get(JwtStrategy))

export { passport }
