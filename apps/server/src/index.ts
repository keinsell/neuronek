import { HttpApplication } from "./application/http.application";
import logProcessErrors from "log-process-errors";
logProcessErrors();

export async function main() {
	new HttpApplication().bootstrap();
}

await main();
