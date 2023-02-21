import passport from 'passport'
import { container } from '../ioc/container.js'
import { JwtStrategy } from '../../../authorization/jwt-strategy.js'

passport.use(container.get(JwtStrategy))

export { passport }
