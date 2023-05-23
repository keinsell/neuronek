import { Specification } from '../../../../../../shared/core/technical/specification.js'
import { Username } from '../username.js'

export class UsernameIsAboveMinimalCharacterLimit extends Specification<Username> {
	static MINIMAL_LENGTH = 4
	public satisfy(i: Username): boolean {
		return i.length >= UsernameIsAboveMinimalCharacterLimit.MINIMAL_LENGTH
	}
}
