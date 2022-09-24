import { Argon2HashingService } from "../../../common/hasher/hasher.common.js";
import { ValueObject } from "../../../common/value-object/value-object.common.js";

export class UserPassword extends ValueObject<string> {
	private hasher = new Argon2HashingService();
	constructor(value: string) {
		super(value);
		this._value = value;
	}

	async build() {
		if (!(await this.isHashed())) {
			this._value = await this.hash();
		}

		return this;
	}

	async isHashed(): Promise<boolean> {
		return this.hasher.isHashed(this._value);
	}

	async compare(password: string): Promise<boolean> {
		return this.hasher.verify(password, this._value);
	}

	async hash(): Promise<string> {
		return this.hasher.hash(this._value);
	}
}
