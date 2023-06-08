import { DomainHandler } from '~foundry/domain'
import { AccountCreated } from './account-created'



export class AccountCreatedHandler
  extends DomainHandler<AccountCreated> {
  public async handle(event: AccountCreated): Promise<void> {
    console.log('AccountCreatedHandler', event)
  }
}
