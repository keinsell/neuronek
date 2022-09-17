import { HttpApplication } from "./application/http.application";
import { syncPersonalJournal } from "./personal-journal";

export async function main() {
  new HttpApplication().bootstrap();
  await syncPersonalJournal();
}

await main();
