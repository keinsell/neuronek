import { Command } from '~foundry/cqrs'
import { MessagePayload } from '~foundry/messaging/message.js'
import { Account } from '../../../domain/entities/account.js'
import { Password } from '../../../domain/value-objects/password.js'
import { Username } from '../../../domain/value-objects/username/username.js'



/**
 * CreateAccountProperties interface defines the properties required to create an account.
 * @publicKey - The PGP public key for the account.
 * @username - The unique username for the account.
 */
interface CreateAccountProperties {
  password: Password
  username: Username
}


/**
 * The CreateAccount command is used to create a new account. It extends the Command class.
 * @publicKey - The PGP public key for the account.
 * @username - The unique username for the account.
 */
export class CreateAccount
  extends Command<CreateAccountProperties, Account>
  implements CreateAccountProperties {
  password: Password
  username: Username

  constructor(payload: MessagePayload<CreateAccountProperties>) {
    super(payload)
    this.password = payload.password
    this.username = payload.username
  }
}
