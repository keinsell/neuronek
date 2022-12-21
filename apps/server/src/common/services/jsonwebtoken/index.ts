import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export class JsonWebTokenService {
	public readonly JWT_SECRET =
		"eZFkJoj3RYKKTIaafFQ0rQzW0T_fHJkjbNJEju4cs-yOoZdGNj0N7CuboF7Vxxzl2S5aBwaoFq9WbA-OBP33Jozjd-mUmtm84JBKlWqw1Afo7fvFGrx9PuYLPsHsB4Mmnjgt1MTF4ZlIxhqIFg8JVxo7odEFgCVLEYZIApZ0RmqlscLaU8tYSVJ05Ep0osqYjfZhZoKsAHaOXCyYVAWgxCsVUGmjGR9Dz4e6WOnxXUBn8sChuC99okAF09g13MI1fBwVwj_zrZHRTI9o_kejawmX_gKRv4lT8GfiCemSBlObEgFGSx6aF6KdtIRFjwXaDpEz1zU3R_5oU6fYPnXSaDbo21lBN_sA-uMzmeRBhyPjMk6l9Ztk9GgCkZg7ol6SzeZ0Ph2HINlRee2cEDUCNlMHlO3GhbzN0EDp7pSyPW3uetwK5oNJaVBtN4fmQF38de1I_dRz1GFFtzy9ISX-gFtSWDplNi_2evT1ln0WZ18LOlazO4oSERpvwXu4QMiNWs33cScHaELYNQrhBzGBuoTogyVbl16YSS2juwlWlsjavV418wpBWutCWLFFQMdW99rysNRlkMkzoq30ICDRASqc_EQeCt6vwYLW3doHPteH2g2golnzvKJwGrRKz4cBxqazop0Rhyt5MAFF3GUC-l8qTf4eJRM4qbAtlB7yfOs1GDBhfnNByfFco-6cmEuu3U2UQuymYwCVb8gwZo0a0EJcdnJIhe-BzglToe9EeW1UC-n03nUN8AZq5BwUyzBHvbJN2Z3eCP2_Tqh3bZ9Uunnu9GEQXRW0EJqG0shJNePdy4i0SueWuzPoyPjLNTdpJ8xwTiEOr2PCO7VkLfdBDiqWWB63jsnO5QprJ5C3bgQAJAxQ3p-WshAfdR85xcqKC66Gfu2Z-8tIKMqpLuIRnaQRBmsRhZlCAyskbu02bhtW669apvzSD1rLyDm9-oW6avKUnee27D3Noi4MxIFbw-Wmny4w86-bp5SoMwG9r6MKXEDWgo-OSnL7yYGaQP_v";

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
