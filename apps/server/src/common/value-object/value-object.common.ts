export class ValueObject<T> {
	protected _value: T;

	constructor(value: T) {
		this._value = value;
	}

	get value(): T {
		return this._value;
	}

	equals(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		if (this === vo) {
			return true;
		}

		if (this.constructor !== vo.constructor) {
			return false;
		}

		return this._value === vo._value;
	}
}
