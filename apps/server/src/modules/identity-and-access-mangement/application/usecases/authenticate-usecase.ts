import { UseCase }                   from '~foundry/domain'
import { InvalidCredentials }        from '~foundry/exceptions/Invalid-credentials.js'
import { NotFound }                  from '~foundry/exceptions/not-found.js'
import { PolicyViolation }           from '~foundry/exceptions/policy-violation.js'
import { left, Result, right }       from '~foundry/technical/result.js'
import { comparePasswordHash }       from '../../domain/value-objects/password-hash.js'
import { generateTokens }            from '../../services/jwt.js'
import { IdentityAndAccessQueryBus } from '../bus/identity-and-access-query-bus.js'
import { Authenticate }              from '../commands/authenticate/authenticate.js'
import { FindAccountByUsername }     from '../queries/get-account-by-username/find-account-by-username.js'



export interface AuthenticateResponse {
	accessToken : string
	refreshToken : string
}


export class AuthenticateUsecase
	extends UseCase<Authenticate, AuthenticateResponse, PolicyViolation> {
	constructor(private readonly queryBus : IdentityAndAccessQueryBus) {
		super()
	}
	
	public async execute(command : Authenticate) : Promise<Result<PolicyViolation, AuthenticateResponse>> {
		const getAccountByUsernameQuery = new FindAccountByUsername( command.username )
		const account = await this.queryBus.handle<FindAccountByUsername>( getAccountByUsernameQuery )
		
		if(!account) {
			return left( new NotFound( 'Account' ) )
		}
		
		const isPasswordSame = await comparePasswordHash( account.password, command.password )
		
		if(!isPasswordSame) {
			return left( new InvalidCredentials() )
		}
		
		const token = generateTokens( account.id )
		
		return right( {
			accessToken: token.accessToken, refreshToken: token.refreshToken,
		} )
	}
}
