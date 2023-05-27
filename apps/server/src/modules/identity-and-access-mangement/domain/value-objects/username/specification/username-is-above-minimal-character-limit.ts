import { Username } from '../username.js'
import { Specification } from '~foundry/technical/specification.js'

export class UsernameIsAboveMinimalCharacterLimit extends Specification<Username> {
	static MINIMAL_LENGTH = 4
	public satisfy(i: Username): boolean {
		return i.length >= UsernameIsAboveMinimalCharacterLimit.MINIMAL_LENGTH
	}
}
