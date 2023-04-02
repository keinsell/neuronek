import jsonwebtoken from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { JWT_SECRET } from '../../deprecated/shared/configuration/environment-variables'

const issuer = 'neuronek.xyz'
const audience = 'account.neuronek.xyz'
const expiresIn = '2h'

export function generateJwtToken(accoundId: string, payload?: any): string {
	const jwtid = nanoid(128)
	const options: jsonwebtoken.SignOptions = {
		expiresIn,
		issuer,
		audience,
		jwtid,
		subject: accoundId
	}
	return jsonwebtoken.sign(payload, JWT_SECRET, options)
}
