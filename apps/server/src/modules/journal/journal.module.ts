import { JournalService } from "./journal.service";
import { JournalRepository } from "./repositories/journal.repository";

export namespace JournalModule {
  export const service = new JournalService();
  export const repository = new JournalRepository();
}
