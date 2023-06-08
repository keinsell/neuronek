import { Specification } from '~foundry/technical/specification.js'

export class IsNanoid extends Specification<string> {
	public satisfy(i: string): boolean {
		const nanoidRegex = new RegExp(`^[a-zA-Z0-9_-]{8,64}$`)
		return nanoidRegex.test(i)
	}
}
