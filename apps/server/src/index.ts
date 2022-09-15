import { syncPersonalJournal } from "./personal-journal";

export async function main() {
  await syncPersonalJournal();
}

await main();
