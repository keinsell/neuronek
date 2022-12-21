import { HttpApplication } from "./application/http.application";
import logProcessErrors from "log-process-errors";
logProcessErrors();

export async function main() {
	new HttpApplication().bootstrap();

	if (process.env.NODE_ENV === "development") {
		console.log(process.env.DATABASE_URI);
		console.log(process.env.TZ);
	}
}

await main();
