// TODO: Add Value Object class
export class ValueObject<T> {
	public _v: T;

	constructor(value: T) {
		this._v = value;
	}
}
