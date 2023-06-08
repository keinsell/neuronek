import { Command } from '~foundry/cqrs'
import { MessagePayload } from '~foundry/messaging/message.js'
import { Password } from '../../../domain/value-objects/password.js'
import { Username } from '../../../domain/value-objects/username/username.js'



interface AuthenticateProperties {
  password: Password
  username: Username
}


export class Authenticate
  extends Command<AuthenticateProperties>
  implements AuthenticateProperties {
  password: Password
  username: Username

  constructor(payload: MessagePayload<AuthenticateProperties>) {
    super(payload)
    this.password = payload.password
    this.username = payload.username
  }
}
