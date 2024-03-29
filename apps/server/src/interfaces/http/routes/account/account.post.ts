import { Body, Controller, OperationId, Post, Response, Route, SuccessResponse, Tags } from 'tsoa'
import {
  IdentityAndAccessCommandBus,
} from '../../../../modules/identity-and-access-mangement/application/bus/identity-and-access-command.bus.js'
import {
  IdentityAndAccessQueryBus,
} from '../../../../modules/identity-and-access-mangement/application/bus/identity-and-access-query-bus.js'
import {
  CreateAccount as CreateAccountCommand,
} from '../../../../modules/identity-and-access-mangement/application/commands/create-account/create-account'
import {
  CreateAccountUsecase,
} from '../../../../modules/identity-and-access-mangement/application/usecases/create-account-usecase'
import {
  createPassword,
} from '../../../../modules/identity-and-access-mangement/domain/value-objects/password.js'
import {
  createUsername,
} from '../../../../modules/identity-and-access-mangement/domain/value-objects/username/username.js'
import {
  Exception,
} from '../../../../shared/@foundry/exceptions/exception.js'



/**
 * Represents the request body for creating an account.
 * @example { "username": "john_doe", "password": "my-password" }
 */
interface CreateAccount {
  /** The username for the account. */
  username: string
  /** The password for the account. */
  password: string
}


@Route('account') @Tags('Account')
export class CreateAccountController
  extends Controller {
  /**
   * Creates an account.
   */
  @Post() @OperationId('create-account') @SuccessResponse('201', 'Created') @Response(403, 'AlreadyExists')
  public async createAccount(@Body() body: CreateAccount): Promise<{ id: string } | { error: string }> {
    try {
      const command = new CreateAccountCommand({
        username: await createUsername(body.username), password: await createPassword(body.password),
      })

      console.log(command)

      const usecase = new CreateAccountUsecase(new IdentityAndAccessQueryBus(), new IdentityAndAccessCommandBus())

      const result = await usecase.execute(command)

      result.unwrapOrElse()

      if (result.isOk()) {
        this.setStatus(201)
        return { id: result.unwrap().id as string }
      } else {
        const unwrappedError = result.unwrap()

        this.setStatus(result.mapErr(e => e.statusCode)))
        return { error: result.left.message }
      }
    }
    catch (error: unknown) {
      if (error instanceof Exception) {
        this.setStatus(error.statusCode)
        return { error: error.message }
      }

      this.setStatus(500)
      return { error: 'Failed to create account' }
    }
  }
}
