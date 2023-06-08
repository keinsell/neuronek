import { Specification } from '~foundry/technical/specification.js'



export class IsUlid extends Specification<string> {
	public satisfy(i: string): boolean {
		const ulidRegex = /^[0-9A-Z]{26}$/

		if (!ulidRegex.test(i)) {
			// The string doesn't match the basic format of a ULID
			return false
		}

		const timestamp = parseInt(i.substr(0, 10), 36)
		//		const entropy = i.substr(10)

		if (isNaN(timestamp)) {
			// The timestamp part is not a valid base36 number
			return false
		}

		// You can perform additional checks on the timestamp and entropy if needed
		// For example, ensuring that the timestamp falls within a valid range, etc.

		return true
	}
}
