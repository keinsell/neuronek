import { Username } from '../username.js'
import { Specification } from '~foundry/technical/specification.js'

export class UsernameIsBelowMaxiumCharacterLimit extends Specification<Username> {
  static MAXIMAL_LENGTH = 32

  public satisfy(i: Username): boolean {
    return i.length <= UsernameIsBelowMaxiumCharacterLimit.MAXIMAL_LENGTH
  }
}
