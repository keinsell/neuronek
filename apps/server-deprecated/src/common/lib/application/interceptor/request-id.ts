import { nanoid } from "nanoid";
import { TinnyHttpInterceptor } from ".";

export class RequestIdInterceptor implements TinnyHttpInterceptor {
	intercept(req: any, res: any, next: any) {
		req.requestId = nanoid(128);
		next();
	}
}
