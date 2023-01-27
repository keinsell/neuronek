import passport from 'passport'
import { container } from '../ioc/container.js'
import { JwtStrategy } from '../../../modules/authorization/jwt-strategy.js'

passport.use(container.get(JwtStrategy))

export { passport }
