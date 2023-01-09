import argon2 from "argon2";
import { IHashingService } from ".";

export class Argon2HashingService implements IHashingService {
	async hash(value: string): Promise<string> {
		return await argon2.hash(value);
	}

	async verify(value: string, hash: string): Promise<boolean> {
		return await argon2.verify(hash, value);
	}

	isHashed(value: string): boolean {
		return value.startsWith("$argon2");
	}
}
