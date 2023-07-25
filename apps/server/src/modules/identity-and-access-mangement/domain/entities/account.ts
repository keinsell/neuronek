import { CUID } from 'escentia'
import { Entity } from '../../../../shared/@foundry/domain/enity.js'
import { PasswordHash } from '../value-objects/password-hash.js'
import { Username } from '../value-objects/username/username.js'

// TODO: This should not be extended on Database Schema, however, it's a faster way for now and I expect quite a lot of
//  changes in this are so this is helpful.
export interface AccountProperties {
  password: PasswordHash
  username: Username
}


export class Account
  extends Entity<CUID>
  implements AccountProperties {
  password: PasswordHash
  username: Username

  constructor(properties: AccountProperties, id?: CUID) {
    super(id)
    this.username = properties.username
    this.password = properties.password
  }

  changeUsername(username: Username): void {
    this.username = username
  }
}
