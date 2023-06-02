import { Specification } from '~foundry/technical/specification.js'



export class IsSequentialID
	extends Specification<number> {
	public satisfy(i: number): boolean {
		return i > 0
	}
}
