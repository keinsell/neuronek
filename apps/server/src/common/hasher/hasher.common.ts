import argon2 from "argon2";

interface HashingService {
	hash(value: string): Promise<string>;
	verify(value: string, hash: string): Promise<boolean>;
}

export class Argon2HashingService implements HashingService {
	async hash(value: string): Promise<string> {
		return await argon2.hash(value);
	}

	async verify(value: string, hash: string): Promise<boolean> {
		return await argon2.verify(hash, value);
	}

	async isHashed(value: string): Promise<boolean> {
		return value.startsWith("$argon2");
	}
}
