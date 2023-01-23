import argon2 from 'argon2'

export class Password {
	public value: string

	constructor(value: string) {
		this.value = value
	}

	// TODO: This is potentially dangerous.
	get isHashed() {
		return this.value.startsWith('$argon2')
	}

	public async hash() {
		if (this.isHashed) {
			return this
		}

		this.value = await argon2.hash(this.value)
		return this
	}

	public async verify(password: string) {
		return argon2.verify(this.value, password)
	}

	public static async fromString(value: string): Promise<Password> {
		return await new Password(value).hash()
	}
}
