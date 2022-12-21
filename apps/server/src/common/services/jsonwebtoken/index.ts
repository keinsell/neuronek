import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export class JsonWebTokenService {
	public readonly JWT_SECRET = nanoid(512);

	sign<T>(payload: T | any, options?: jwt.SignOptions): string {
		return jwt.sign(payload, this.JWT_SECRET, options);
	}

	verify<T>(token: string, options?: jwt.VerifyOptions): T | any | undefined {
		try {
			return jwt.verify(token, this.JWT_SECRET, options);
		} catch (err) {
			return undefined;
		}
	}
}
