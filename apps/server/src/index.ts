import { HttpApplication } from "./application/http.application";

export async function main() {
  new HttpApplication().bootstrap();
  // await syncPersonalJournal();
}

await main();
