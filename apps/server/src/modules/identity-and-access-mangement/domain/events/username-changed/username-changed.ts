
import { DomainEvent } from '../../../../../shared/@foundry/domain/domain-event.js'
import { Account } from '../../entities/account.js'



export class UsernameChanged extends DomainEvent<Account> {
  constructor(public readonly account: Account) {
    super()
  }
}
