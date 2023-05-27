export abstract class ValueObject {
	equals(other: ValueObject): boolean {
		return this === other
	}
}
