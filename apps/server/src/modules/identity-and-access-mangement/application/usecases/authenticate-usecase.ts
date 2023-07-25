import { Err, Ok, UseCase } from 'escentia'
import { InvalidCredentials } from '~foundry/exceptions/Invalid-credentials.js'
import { NotFound } from '~foundry/exceptions/not-found.js'
import { Account } from '../../domain/entities/account.js'
import { comparePasswordHash } from '../../domain/value-objects/password-hash.js'
import { generateTokens } from '../../services/jwt.js'
import { IdentityAndAccessQueryBus } from '../bus/identity-and-access-query-bus.js'
import { Authenticate } from '../commands/authenticate/authenticate.js'
import { FindAccountByUsername } from '../queries/get-account-by-username/find-account-by-username.js'



export interface AuthenticateResponse {
  accessToken: string
  refreshToken: string
}


export class AuthenticateUsecase
  extends UseCase<Authenticate, AuthenticateResponse, InvalidCredentials> {
  constructor(private readonly queryBus: IdentityAndAccessQueryBus) {
    super()
  }

  public async execute(command: Authenticate) {
    const getAccountByUsernameQuery = new FindAccountByUsername(command.username)
    const account = await this.queryBus.handle<FindAccountByUsername>(getAccountByUsernameQuery)

    if (!account) {
      return Err(new NotFound(typeof Account))
    }

    const isPasswordSame = await comparePasswordHash(account.password, command.password)

    if (!isPasswordSame) {
      return Err(new InvalidCredentials())
    }

    const token = generateTokens(account.id as any)

    return Ok({
      accessToken: token.accessToken, refreshToken: token.refreshToken,
    })
  }
}
